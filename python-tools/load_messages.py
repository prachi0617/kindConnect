import csv
import json
import urllib.request

API_URL = "http://localhost:8080/api/messages"
CSV_FILE = "python-tools/messages.csv"


def post_message(message):
    data = json.dumps(message).encode("utf-8")

    request = urllib.request.Request(
        API_URL,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    with urllib.request.urlopen(request) as response:
        return response.read().decode("utf-8")


def main():
    with open(CSV_FILE, newline="", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            message = {
                "userId": int(row["userId"]),
                "title": row["title"],
                "content": row["content"],
                "type": row["type"],
                "readMessage": row["readMessage"].lower() == "true"
            }

            result = post_message(message)
            print("Saved:", result)


if __name__ == "__main__":
    main()