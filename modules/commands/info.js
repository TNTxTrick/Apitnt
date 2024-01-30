import requests

def stalk(id, token):
    try:
        resp = requests.get('https://graph.facebook.com/{}?fields=id,is_verified,work,hometown,username,link,name,locale,location,about,website,birthday,gender,relationship_status,first_name,subscribers.limit(0)&access_token={}'.format(id, token), headers={'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like) Version/12.0 eWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1', 'accept': 'application/json, text/plain, /'}).json()

        name = resp.get('name', 'No data!')
        link_profile = resp.get('link', 'No data!')
        uid = resp.get('id', 'No data!')
        first_name = resp.get('first_name', 'No data!')
        username = resp.get('username', 'No data!')
        web = resp.get('website', 'No data!')
        gender = resp.get('gender', 'No data!')
        relationship_status = resp.get('relationship_status', 'No data!')
        bday = resp.get('birthday', 'No data!')
        follower = resp.get('subscribers', {}).get('summary', {}).get('total_count', 'No data!')
        locale = resp.get('locale', 'No data!')
        is_verified = resp.get('is_verified', False)
        about = resp.get('about', 'No data!')
        hometown = resp.get('hometown', {}).get('name', 'No hometown!')
        livein = resp.get('location', {}).get('name', 'No data!')
        workplace = '\n'.join([f"- {work['employer']['name']}" for work in resp['work']]) if 'work' in resp and resp['work'] else 'No data!'
        followers = str('{:,}'.format(follower))
        avatar = f"https://graph.facebook.com/{id}/picture?width=1500&height=1500&access_token=1174099472704185|0722a7d5b5a4ac06b11450f7114eb2e9"
        reply = """•——INFORMATION——•
Name: {}
First name: {}
Profile link: {}
Gender: {}
Relationship Status: {}
Birthday: {}
Follower(s): {}
Current city: {}
Hometown: {}
Locale: {}
Workplace: \n{}
•——END——•""".format(name, first_name, link_profile, gender, relationship_status, bday, followers, livein, hometown, locale, workplace)
        return reply, avatar

    except Exception as e:
        return f"❌𝚂𝙾𝚁𝚁𝚈, 𝚆𝙴 𝙰𝚁𝙴 𝙷𝙰𝚅𝙸𝙽𝙶 𝙴𝚁𝚁𝙾𝚁 𝙵𝙴𝚃𝙲𝙷𝙸𝙽𝙶: {str(e)}"

def command(input_value, thread_userid=None):
    config = {
        "name": "stalk",
        "version": "1.0.0",
        "description": "Get info using uid/reply to a message",
        "credits": "Mahiro chan",
        "cooldown": "2"
    }
    token = "EAAAAUaZ...."
    if input_value == "__config__":
        return config
    elif input_value.startswith(config['name']):
        id = input_value[len(config['name']):].strip()
        if any(sub in id for sub in ['https://www.facebook.com/', 'https://www.facebook.com/profile.php?id=']):
            return {'messages': ['❌𝙴𝙽𝚃𝙴𝚁 𝙸𝙳 𝙾𝙽𝙻𝚈.']}
        else:
            if id != '':
                onlyvalid = ['615', '100']
                if any(id.startswith(validid) for validid in onlyvalid):
                    result, url = stalk(id, token)
                    return {'messages': [str(result)], 'sendfromurl': [str(url)]}
                else:
                    return {'messages': ['❌𝙴𝙽𝚃𝙴𝚁 𝚅𝙰𝙻𝙸𝙳 𝙸𝙳 𝙾𝙽𝙻𝚈.']}
            else:
                result, url = stalk(thread_userid.uid, token)
                return {'messages': [str(result)], 'sendfromurl': [str(url)]}
    else:
        return {'messages': [f"Default option in {config['name']}: {config['description']}"]}
