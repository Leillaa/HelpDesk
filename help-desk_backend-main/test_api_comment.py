#!/usr/bin/env python3
"""
Тестирование API создания комментария с отправкой в Telegram
"""
import requests
import json

# Настройки
API_BASE = "http://127.0.0.1:8000"
USERNAME = "admin"
PASSWORD = "123"  # Используем простой пароль, который мы создали

def get_auth_token():
    """Получаем токен авторизации"""
    url = f"{API_BASE}/api/login/"
    data = {
        'username': USERNAME,
        'password': PASSWORD
    }
    
    response = requests.post(url, data=data)
    if response.status_code == 200:
        return response.json().get('token')
    else:
        print(f"❌ Auth failed: {response.status_code} - {response.text}")
        return None

def create_comment(ticket_id, comment_text, token):
    """Создаем комментарий через API"""
    url = f"{API_BASE}/app/comment_create/{ticket_id}/"
    
    headers = {
        'Authorization': f'Token {token}'
    }
    
    # Имитируем данные формы как из фронтенда
    data = {
        'user_id': '6',  # ID администратора
        'content': comment_text
    }
    
    response = requests.post(url, data=data, headers=headers)
    
    print(f"📝 Comment API Response: {response.status_code}")
    print(f"📝 Response body: {response.text}")
    
    return response.status_code == 200

def test_comment_api():
    """Тестируем создание комментария через API"""
    
    print("🧪 Testing comment API with Telegram notifications...")
    
    # Используем готовый токен администратора
    token = "3c728f283cb85a6b2c5fc3731bd83fc34acfbbc5"
    print(f"✅ Using admin token: {token[:20]}...")
    
    # Создаем комментарий для заявки #6 (создана через Telegram)
    ticket_id = 6
    comment_text = "Здравствуйте! Это тестовый ответ через API. Ваша заявка обрабатывается."
    
    success = create_comment(ticket_id, comment_text, token)
    
    if success:
        print("✅ Comment created successfully via API!")
        print("📱 Check Telegram for the reply message")
        return True
    else:
        print("❌ Failed to create comment via API")
        return False

if __name__ == "__main__":
    test_comment_api()