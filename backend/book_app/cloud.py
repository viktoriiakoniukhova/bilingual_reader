import requests

from book_app.settings import TRANSLATOR_CREDENTIALS, TTS_CREDENTIALS


def translate_text(
    text: str,
    target_language: str = "uk",
    source_language: str = "en",
):
    """Translate text using IBM Watson Language Translator API
    
    Args:
        text (str): Text to translate
        target_language (str, optional): Target language. Defaults to "uk".
        source_language (str, optional): Source language. Defaults to "en".

    Returns:
        dict: Dictionary with translated text and status of the response
    """
    assert source_language in ["en", "uk"]
    assert target_language in ["en", "uk"]

    url = TRANSLATOR_CREDENTIALS["url"]
    apikey = TRANSLATOR_CREDENTIALS["apikey"]
    response = requests.post(
        f"{url}/v3/translate?version=2018-05-01",
        headers={"Content-Type": "application/json"},
        auth=("apikey", apikey),
        json={
            "text": [text],
            "model_id": f"{source_language}-{target_language}",
        }
    )
    if response.status_code == 200:
        translated_text = response.json()["translations"][0]["translation"].strip("., ")
    else:
        translated_text = ''

    return {
        'translated_text': translated_text,
        'status': response.status_code,
    }


def synthesize_text(text: str, voice: str = "en-US_AllisonV3Voice"):
    """Synthesize text to speech using IBM Watson Text to Speech API
    
    Args:
        text (str): Text to synthesize
        voice (str, optional): Voice to use. Defaults to "en-US_AllisonV3Voice".

    Returns:
        dict: Dictionary with binary content, status, and format of the response
    """
    url = TTS_CREDENTIALS["url"]
    apikey = TTS_CREDENTIALS["apikey"]
    response = requests.post(
        f"{url}/v1/synthesize?voice={voice}",
        headers={"Content-Type": "application/json", "Accept": "audio/wav"},
        auth=("apikey", apikey),
        json={"text": text},
    )
    if response.status_code == 200:
        content = response.content
    else:
        content = b''

    return {
        'content': content,
        'status': response.status_code,
        'format': response.headers.get('Content-Type'),
    }
