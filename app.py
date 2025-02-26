from flask import Flask, render_template, jsonify, request
import os,json

app = Flask(__name__)

Task_file="tasks.txt"

def load_tasks():
    if not os.path.exists(Task_file) or os.stat(Task_file).st_size == 0:
        return []
    try:
        with open(Task_file, "r") as file:
            return json.load(file)
    except json.JSONDecodeError:
        return []

def save_tasks(tasks):
    with open(Task_file, "w") as file:
       #return file.write("\n".join(tasks))
        json.dump(tasks, file)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = load_tasks()
    return jsonify(tasks)

@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.json
    task = data.get("task","").strip()
    dateTime = data.get("dateTime","").strip();
    if task and dateTime:
        tasks = load_tasks()
        tasks.append({"task":task, "dateTime": dateTime});
        save_tasks(tasks)
        return jsonify({"message":"Task added succesfully"}), 201
    return jsonify({"error":"Invalid task"}), 400

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    tasks = load_tasks()
    if 0<= task_id <len(tasks):
        tasks.pop(task_id)
        save_tasks(tasks)
        return jsonify({"message": "Task deleted successfully"})
    return jsonify({"error":"Invalid Task"}), 400

@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
        data = request.json;
        tasks = load_tasks()
        if 0<=task_id<len(tasks):
            tasks[task_id] ={
                 "task": data["task"], 
            "dateTime": data["dateTime"]
                   }
            save_tasks(tasks)
            return jsonify({"message": "Task updated successfully"})
        return jsonify({"error":"Invalid Task"}), 400
            
        
        
if __name__ == "__main__":
    #app.run(debug=True)
    port = int(os.environ.get("PORT", 5000))  # Get port from Railway
    app.run(host="0.0.0.0", port=port)
