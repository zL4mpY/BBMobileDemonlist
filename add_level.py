import json
from pathlib import Path
import os

DATA_DIR = Path(__file__).absolute().parent / "data"

if __name__ == '__main__':
    while (running := True):
        print("1. Level ID (q to cancel)")
        while True:
            id_ = input(">>> ").strip()
            if id_.lower() == "":
                continue

            if id_.lower() == "q":
                running = False
                break

            if not id_.isdigit():
                print("The ID must be numeric.")
                continue
            
            break

        if not running: break

        print("2. Level name (q to cancel)")
        while True:
            name = input(">>> ").strip()
            if name.lower() == "":
                continue

            if name.lower() == "q":
                running = False
                break
            
            break

        if not running: break

        print("3. Level publisher (q to cancel)")
        while True:
            author = input(">>> ").strip()
            if author.lower() == "q":
                running = False

            if author.lower() == "":
                continue
            
            break

        if not running: break

        print("4. Level creators (separate with commas, q to cancel)")
        while True:
            creators = input(">>> ").strip()
            if creators == "":
                continue

            if creators.lower() == "q":
                running = False
                break

            break

        if not running: break

        print("5. Level verifier (q to cancel)")
        while True:
            verifier = input(">>> ").strip()
            if verifier == "":
                continue

            if verifier.lower() == "q":
                running = False
                break

            break

        if not running: break

        print("6. Level verification video link (q to cancel)")
        while True:
            verification = input(">>> ").strip()
            if verification == "":
                continue

            if verification.lower() == "q":
                running = False
                break

            break

        if not running: break

        print("7. Level percent to qualify (q to cancel)")
        while True:
            percent_to_qualify = input(">>> ").strip()
            if percent_to_qualify == "":
                continue

            if percent_to_qualify.lower() == "q":
                running = False
                break
            
            if not percent_to_qualify.isdigit():
                print("The percent must be numeric.")
                continue

            break

        if not running: break

        level = {
            "id": id_,
            "name": name,
            "author": author,
            "creators": creators.split(","),
            "verifier": verifier,
            "verification": verification,
            "percentToQualify": percent_to_qualify,
            "records": []
        }

        level_path = DATA_DIR / (level["name"].lower().replace(" ", "") + ".json")
        with open(level_path, "w", encoding="utf-8") as f:
            json.dump(level, f, indent=4)
        
        print("7. Level position in the list (q to cancel)")
        while True:
            position = input(">>> ").strip()
            if position == "":
                continue

            if position.lower() == "q":
                os.remove(level_path)
                running = False
                break
            
            if not position.lstrip("-").isdigit():
                print("The position must be numeric.")
                continue

            break

        if not running: break

        with open(DATA_DIR / "_list.json", "r", encoding="utf-8") as f:
            list_: list = json.load(f)

        if int(position) <= 0:
            list_.insert(len(list_) + int(position), level["name"].lower().replace(" ", "") )
        else:
            list_.insert(int(position)-1, level["name"].lower().replace(" ", ""))

        with open(DATA_DIR / "_list.json", "w", encoding="utf-8") as f:
            json.dump(list_, f, indent=4)

        print("The level was added successfully.")