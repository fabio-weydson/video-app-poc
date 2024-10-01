import re

def sanitize_input(input_string):
    """
    Sanitize input string by removing special characters
    Args:
        input_string (str): input string to be sanitized
    """
    sanitized_string = re.sub(r"[;\'\"\\]", "", input_string)
    return sanitized_string

def extract_youtube_id(url):
    """
    Extract the YouTube video ID from a URL
    Args:
        url (str): YouTube URL
    Returns:
        str: YouTube video ID or None if not found
    """
    
    if(url.find('?v=') == -1):
        return url
    
    pattern = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(pattern, url)
    if match:
        return match.group(1)
    return None