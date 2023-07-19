import requests
import json

sessionKey = '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'

headers = {
  "Accept": "application/json, text/plain, */*",
  "Cookie": f"sessionKey={sessionKey}",
  "Content-Type": "application/json",
  "Connection": "close",
  "User-Agent": "RapidAPI/4.2.0 (Macintosh; OS X/13.0.1) GCDHTTPRequest",
}

def get_organizations():
  try:
    response = requests.get("https://claude.ai/api/organizations", headers=headers)
    data = response.json()
    print(data)
    return data
  except requests.exceptions.RequestException as err:
    print ("OOps: Something Else Happened:",err)
  except requests.exceptions.HTTPError as errh:
    print ("Http Error:",errh)
  except requests.exceptions.ConnectionError as errc:
    print ("Error Connecting:",errc)
  except requests.exceptions.Timeout as errt:
    print ("Timeout Error:",errt) 

get_organizations()
