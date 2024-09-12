# from bs4 import BeautifulSoup
# import requests
# from urllib.parse import urljoin
# import firebase_admin
# from firebase_admin import credentials
# from firebase_admin import firestore
# import smtplib
# from email.message import EmailMessage
# import ssl

# cred = credentials.Certificate("/Users/kevinzheng/Downloads/product-management-699f5-firebase-adminsdk-36638-7cff4efb71.json")
# firebase_admin.initialize_app(cred)

# # The object we are going to use to communicate with firestore
# db = firestore.client()

# doc_ref = db.collection('amazonCollection')

# custom_header = {
#   'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36', 'Accept-Language': 'en-US,en;q=0.9'}

# body = """
  
# """

# def new_title(title):
#   title = title.replace("[", "_")
#   title = title.replace("\\", "_")
#   title = title.replace("#", "_")
#   title = title.replace("?", "_")
#   title = title.replace("]", "_")
#   title = title.replace("/", "_")
#   title = title.strip()
#   return title

# def get_product_info(element, url):
#   # Get the title element
#   title_element = element.find('span', {'class': 'a-size-medium a-color-base a-text-normal'})
#   title = title_element.text.strip() if title_element else 'No Title'

#   rating_element = element.find('span', {'class': 'a-icon-alt'})
#   rating = rating_element.text.strip() if rating_element else 'No Rating'

#   reviewers_element = element.find('span', {'class': "a-size-base s-underline-text"})
#   reviewers = reviewers_element.text.strip() if reviewers_element else 'No Reviewers'

#   whole_price_element = element.find('span', {'class': "a-price-whole"})
#   whole_price = whole_price_element.text.strip() if whole_price_element else 'Unknown'
#   fraction_price = ""

#   if whole_price != "Unknown":
#     fraction_price_element = element.find('span', {'class': "a-price-fraction"})
#     fraction_price = fraction_price_element.text.strip() if fraction_price_element else ""

#   price = whole_price + fraction_price

#   link_element = element.select_one("h2 a")
#   link = link_element.attrs.get("href") if link_element else None
#   if link != None:
#     link = urljoin(url, link)

#   image_element = element.find('img', {'class': "s-image"})
#   image = image_element.attrs.get("src") if image_element else None

#   return {
#     "id" : new_title(title),
#     "title": title,
#     "rating": rating,
#     "reviewers": reviewers,
#     "price": price,
#     "link": link,
#     "image": image,
#     "isFavored": False
#   }

# def parse_page(url):
#   response = requests.get(url, headers = custom_header)
#   soup = BeautifulSoup(response.text, 'lxml')
#   elements = soup.find_all('div', {'class': "puis-card-container s-card-container s-overflow-hidden aok-relative puis-include-content-margin puis puis-v1ic4lgpvxpgtt2441n2jysslfc s-latency-cf-section puis-card-border"})
  
#   for element in elements:
#     product_info = get_product_info(element, url)
#     doc_id = product_info['id']
#     doc = doc_ref.document(doc_id).get()

#     if doc.exists:
#       existing_data = doc.to_dict()
#       if ((existing_data['isFavored'] == True) and (float(product_info['price']) < float(existing_data['price']))):
#         url = existing_data['link']
#         body += f"{existing_data['title']}\n: {url}\n"  
#       product_info['isFavored'] = existing_data['isFavored']

#     doc_ref.document(doc_id).set(product_info)

#   next_page_link_element = soup.find('a', {'class': "s-pagination-item s-pagination-next s-pagination-button s-pagination-separator"})
#   if next_page_link_element:
#     next_page_link = next_page_link_element.attrs.get("href")
#     next_page_link = urljoin(url, next_page_link)
#     parse_page(next_page_link)
  

# def main(): 
#   url = "https://www.amazon.com/headphones/s?k=headphones"
#   parse_page(url)
#   if body:
#     email_sender = "kz3534773@gmail.com"
#     email_password = "oswy ovql cdus lzqk"
#     email_receiver = "kz3534773@gmail.com"

#     subject = "Discounted Items"
#     em = EmailMessage()
#     em['From'] = email_sender
#     em['To'] = email_receiver
#     em['Subject'] = subject

#     em.set_content(body)
#     context = ssl.create_default_context()

#     with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
#       smtp.login(email_sender, email_password)
#       smtp.sendmail(email_sender, email_receiver, em.as_string())


# if __name__ == "__main__":
#   main()  

# from bs4 import BeautifulSoup
# import requests
# from urllib.parse import urljoin
# import firebase_admin
# from firebase_admin import credentials, firestore
# import smtplib
# from email.message import EmailMessage
# import ssl
# import sys
# from flask import Flask, request, jsonify
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# # Firebase setup
# cred = credentials.Certificate("/Users/kevinzheng/Downloads/product-management-699f5-firebase-adminsdk-36638-7cff4efb71.json")
# firebase_admin.initialize_app(cred)
# db = firestore.client()
# doc_ref = db.collection('amazonIphoneCollection')

# custom_header = {
#   'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36', 
#   'Accept-Language': 'en-US,en;q=0.9'
# }

# body = ""  # Email body

# def new_title(title):
#   return title.replace("[", "_").replace("\\", "_").replace("#", "_").replace("?", "_").replace("]", "_").replace("/", "_").strip()

# def get_product_info(element, url):
#   title_element = element.find('span', {'class': 'a-size-medium a-color-base a-text-normal'})
#   title = title_element.text.strip() if title_element else 'No Title'

#   rating_element = element.find('span', {'class': 'a-icon-alt'})
#   rating = rating_element.text.strip() if rating_element else 'No Rating'

#   reviewers_element = element.find('span', {'class': "a-size-base s-underline-text"})
#   reviewers = reviewers_element.text.strip() if reviewers_element else 'No Reviewers'

#   whole_price_element = element.find('span', {'class': "a-price-whole"})
#   whole_price = whole_price_element.text.strip() if whole_price_element else 'Unknown'
#   fraction_price = element.find('span', {'class': "a-price-fraction"}).text.strip() if whole_price != "Unknown" else ""

#   price = whole_price + fraction_price

#   link_element = element.select_one("h2 a")
#   link = urljoin(url, link_element.attrs.get("href")) if link_element else None

#   image_element = element.find('img', {'class': "s-image"})
#   image = image_element.attrs.get("src") if image_element else None

#   return {
#     "id": new_title(title),
#     "title": title,
#     "rating": rating,
#     "reviewers": reviewers,
#     "price": price,
#     "link": link,
#     "image": image,
#     "isFavored": False
#   }

# def parse_page(url):
#     global body
#     try:
#         response = requests.get(url, headers=custom_header)
#         response.raise_for_status()
#     except requests.RequestException as e:
#         print(f"Request failed: {e}")
#         return
    
#     soup = BeautifulSoup(response.text, 'lxml')
#     print(f"Page content preview: {response.text[:1000]}")  # Debug print

#     elements = soup.find_all('div', {'class': "puis-card-container s-card-container s-overflow-hidden aok-relative puis-include-content-margin puis puis-v1ic4lgpvxpgtt2441n2jysslfc s-latency-cf-section puis-card-border"})
#     print(f"Number of products found on the page: {len(elements)}")

#     for element in elements:
#         product_info = get_product_info(element, url)
#         print(f"Scraped Product Info: {product_info}")  # Debug print

#         doc_id = product_info['id']
#         doc = doc_ref.document(doc_id).get()

#         if doc.exists:
#             existing_data = doc.to_dict()
#             if existing_data['isFavored'] and float(product_info['price'].replace(",", "")) < float(existing_data['price'].replace(",", "")):
#                 body += f"{existing_data['title']}\n: {existing_data['link']}\n"
#             product_info['isFavored'] = existing_data['isFavored']

#         doc_ref.document(doc_id).set(product_info)

#     next_page_link_element = soup.find('a', {'class': "s-pagination-item s-pagination-next"})
#     if next_page_link_element:
#         next_page_link = urljoin(url, next_page_link_element.attrs.get("href"))
#         parse_page(next_page_link)
#     else:
#         print("No next page found.")


# def send_email():
#   if body:
#     email_sender = "your_email@gmail.com"
#     email_password = "your_email_password"
#     email_receiver = "your_email@gmail.com"

#     subject = "Discounted Items"
#     em = EmailMessage()
#     em['From'] = email_sender
#     em['To'] = email_receiver
#     em['Subject'] = subject
#     em.set_content(body)

#     context = ssl.create_default_context()
#     with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
#       smtp.login(email_sender, email_password)
#       smtp.sendmail(email_sender, email_receiver, em.as_string())

# @app.route('/api/scrape', methods=['POST'])
# def scrape():
#     data = request.get_json()
#     url = data.get('url')
#     if url:
#         # Call your scraping function with the URL
#         parse_page(url)  # Assuming parse_page is your scraping function
#         return jsonify({"message": "Scraping started"}), 200
#     else:
#         return jsonify({"error": "No URL provided"}), 400

# if __name__ == "__main__":
#     app.run(debug=True)


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

# Firebase setup
cred = credentials.Certificate("/Users/kevinzheng/Downloads/product-management-699f5-firebase-adminsdk-36638-7cff4efb71.json")
firebase_admin.initialize_app(cred)
db = firestore.client()
doc_ref = db.collection('amazonIpadCollection')

custom_header = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36', 
  'Accept-Language': 'en-US,en;q=0.9'
}

body = ""  # Email body

def new_title(title):
  return title.replace("[", "_").replace("\\", "_").replace("#", "_").replace("?", "_").replace("]", "_").replace("/", "_").strip()

def get_product_info(element, url):
  title_element = element.find('span', {'class': 'a-size-medium a-color-base a-text-normal'})
  title = title_element.text.strip() if title_element else 'No Title'

  rating_element = element.find('span', {'class': 'a-icon-alt'})
  rating = rating_element.text.strip() if rating_element else 'No Rating'

  reviewers_element = element.find('span', {'class': "a-size-base s-underline-text"})
  reviewers = reviewers_element.text.strip() if reviewers_element else 'No Reviewers'

  whole_price_element = element.find('span', {'class': "a-price-whole"})
  whole_price = whole_price_element.text.strip() if whole_price_element else 'Unknown'
  fraction_price = element.find('span', {'class': "a-price-fraction"}).text.strip() if whole_price != "Unknown" else ""

  price = whole_price + fraction_price

  link_element = element.select_one("h2 a")
  link = urljoin(url, link_element.attrs.get("href")) if link_element else None

  image_element = element.find('img', {'class': "s-image"})
  image = image_element.attrs.get("src") if image_element else None

  return {
    "id": new_title(title),
    "title": title,
    "rating": rating,
    "reviewers": reviewers,
    "price": price,
    "link": link,
    "image": image,
    "isFavored": False
  }

def parse_page(url):
  print(f"URL: {url}")
  global body
  try:
    response = requests.get(url, headers=custom_header)
    response.raise_for_status()
  except requests.RequestException as e:
    print(f"Request failed: {e}")
    return
  
  soup = BeautifulSoup(response.text, 'lxml')
  print(f"Page content preview: {response.text[:1000]}")  # Debug print

  elements = soup.find_all('span', {'class': "a-declarative"})
  print(f"Number of products found on the page: {len(elements)}")

  for element in elements:
    product_info = get_product_info(element, url)
    print(f"Scraped Product Info: {product_info}")  # Debug print

    doc_id = product_info['id']
    doc = doc_ref.document(doc_id).get()

    if doc.exists:
      existing_data = doc.to_dict()
      if existing_data['isFavored'] and float(product_info['price'].replace(",", "")) < float(existing_data['price'].replace(",", "")):
        body += f"{existing_data['title']}\n: {existing_data['link']}\n"
      product_info['isFavored'] = existing_data['isFavored']

    doc_ref.document(doc_id).set(product_info)

  next_page_link_element = soup.find('a', {'class': "s-pagination-item s-pagination-next"})
  if next_page_link_element:
    next_page_link = urljoin(url, next_page_link_element.attrs.get("href"))
    parse_page(next_page_link)
  else:
    print("No next page found.")

def send_email():
  if body:
    email_sender = "your_email@gmail.com"
    email_password = "your_email_password"
    email_receiver = "your_email@gmail.com"

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
  print(f"Received request to scrape URL: {url}")  # Debug print
  if url:
    parse_page(url)
    print("Scraping started")  # Debug print
    return jsonify({"message": "Scraping started"}), 200
  else:
    print("No URL provided")  # Debug print
    return jsonify({"error": "No URL provided"}), 400

if __name__ == "__main__":
  app.run(debug=True)
