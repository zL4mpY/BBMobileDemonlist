import json
from pathlib import Path

DATA_DIR = Path(__file__).absolute().parent / "data"

if __name__ == '__main__':
    while (running := True):
        print("1. Level name (q to cancel)")
        while True:
            name = input(">>> ").strip()
            if name.lower() == "":
                continue

            if name.lower() == "q":
                running = False
                break

            if not ((level := DATA_DIR / (name.lower().replace(" ", "") + ".json")).exists()):
                print("This level does not exist.")
                continue
            
            break

        if not running: break

        print("2. Record user (q to cancel)")
        while True:
            user = input(">>> ").strip()
            if user.lower() == "":
                continue

            if user.lower() == "q":
                running = False
                break
            
            break

        if not running: break

        print("3. Record link (q to cancel)")
        while True:
            link = input(">>> ").strip()
            if link.lower() == "q":
                running = False
                break

            if link.lower() == "":
                continue
            
            break

        if not running: break

        print("4. Record percent (q to cancel)")
        while True:
            percent = input(">>> ").strip()
            if percent == "":
                continue

            if percent.lower() == "q":
                running = False
                break
            
            if not percent.isdigit():
                print("The percent must be numeric.")
                continue

            break

        if not running: break

        print("5. Record device refresh rate (q to cancel)")
        while True:
            hz = input(">>> ").strip()
            if hz == "":
                continue

            if hz.lower() == "q":
                running = False
                break
            
            if not hz.isdigit():
                print("The refresh rate must be numeric.")
                continue

            break

        if not running: break

        record = {
            "user": user,
            "link": link,
            "percent": int(percent),
            "hz": int(hz)
        }

        with open(level, "r", encoding="utf-8") as f:
            jsonized_level = json.load(f)
        
        jsonized_level.get("records").append(record)

        with open(level, "w", encoding="utf-8") as f:
            json.dump(jsonized_level, f, indent=4)

        print("The record was added successfully.")
