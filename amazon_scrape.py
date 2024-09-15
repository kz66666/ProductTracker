from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin
import firebase_admin
from firebase_admin import credentials, firestore
import smtplib
from email.message import EmailMessage
import ssl
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

cred = credentials.Certificate("/Users/kevinzheng/Downloads/product-management-699f5-firebase-adminsdk-36638-7cff4efb71.json")
firebase_admin.initialize_app(cred)

# The object we are going to use to communicate with firestore
db = firestore.client()

doc_ref = db.collection('amazonCollection')

custom_header = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36', 'Accept-Language': 'en-US,en;q=0.9'}

body = """
  
"""

def new_title(title):
  title = title.replace("[", "_")
  title = title.replace("\\", "_")
  title = title.replace("#", "_")
  title = title.replace("?", "_")
  title = title.replace("]", "_")
  title = title.replace("/", "_")
  title = title.strip()
  return title

def get_product_info(element, url):
  # Get the title element
  title_element = element.find('span', {'class': 'a-size-medium a-color-base a-text-normal'})
  title = title_element.text.strip() if title_element else 'No Title'

  rating_element = element.find('span', {'class': 'a-icon-alt'})
  rating = rating_element.text.strip() if rating_element else 'No Rating'

  reviewers_element = element.find('span', {'class': "a-size-base s-underline-text"})
  reviewers = reviewers_element.text.strip() if reviewers_element else 'No Reviewers'

  whole_price_element = element.find('span', {'class': "a-price-whole"})
  whole_price = whole_price_element.text.strip() if whole_price_element else 'Unknown'
  fraction_price = ""

  if whole_price != "Unknown":
    fraction_price_element = element.find('span', {'class': "a-price-fraction"})
    fraction_price = fraction_price_element.text.strip() if fraction_price_element else ""

  price = whole_price + fraction_price

  link_element = element.select_one("h2 a")
  link = link_element.attrs.get("href") if link_element else None
  if link != None:
    link = urljoin(url, link)

  image_element = element.find('img', {'class': "s-image"})
  image = image_element.attrs.get("src") if image_element else None

  return {
    "id" : new_title(title),
    "title": title,
    "rating": rating,
    "reviewers": reviewers,
    "price": price,
    "link": link,
    "image": image,
    "isFavored": False
  }

def parse_page(url):
  response = requests.get(url, headers = custom_header)
  soup = BeautifulSoup(response.text, 'lxml')
  elements = soup.find_all('span', {'class': "a-declarative"})
  
  for element in elements:
    product_info = get_product_info(element, url)
    doc_id = product_info['id']
    doc = doc_ref.document(doc_id).get()

    if doc.exists:
      existing_data = doc.to_dict()
      if ((existing_data['isFavored'] == True) and (float(product_info['price']) < float(existing_data['price']))):
        url = existing_data['link']
        body += f"{existing_data['title']}\n: {url}\n"  
      product_info['isFavored'] = existing_data['isFavored']

    doc_ref.document(doc_id).set(product_info)

  next_page_link_element = soup.find('a', {'class': "s-pagination-item s-pagination-next s-pagination-button s-pagination-separator"})
  if next_page_link_element:
    next_page_link = next_page_link_element.attrs.get("href")
    next_page_link = urljoin(url, next_page_link)
    parse_page(next_page_link)
  

def send_email(): 
  if body:
    email_sender = "kz3534773@gmail.com"
    email_password = "oswy ovql cdus lzqk"
    email_receiver = "kz3534773@gmail.com"

    subject = "Discounted Items"
    em = EmailMessage()
    em['From'] = email_sender
    em['To'] = email_receiver
    em['Subject'] = subject

    em.set_content(body)
    context = ssl.create_default_context()

    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
      smtp.login(email_sender, email_password)
      smtp.sendmail(email_sender, email_receiver, em.as_string()) 

@app.route('/api/scrape', methods=['POST'])
def scrape():
    data = request.get_json()
    url = data.get('url')
    if url:
        # Call your scraping function with the URL
        parse_page(url)  # Assuming parse_page is your scraping function
        send_email()
        return jsonify({"message": "Scraping started"}), 200
    else:
        return jsonify({"error": "No URL provided"}), 400

if __name__ == "__main__":
    app.run(debug=True)
