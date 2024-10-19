import sqlite3
import random
import time
import csv
import os
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS

app = Flask(__name__, static_folder='docs/build', static_url_path='')
CORS(app)

# Database functions
def create_connection(db_file):
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except sqlite3.Error as e:
        print(e)
    return conn

def fetch_question(conn, difficulty_level):
    cur = conn.cursor()
    cur.execute("SELECT * FROM questions WHERE difficulty = ? ORDER BY RANDOM() LIMIT 1", (difficulty_level,))
    return cur.fetchone()

def check_answer(user_answer, correct_answer):
    return user_answer.lower() == correct_answer.lower()

def calculate_score(streak, total_questions, correct_answers, avg_time, highest_difficulty):
    accuracy = (correct_answers / total_questions) * 100
    time_factor = 1 if avg_time <= 10 else (20 - min(avg_time, 20)) / 10
    difficulty_factor = (highest_difficulty + 1) / 3
    score = (streak * 10 + accuracy * 0.5) * time_factor * difficulty_factor

    if score >= 90:
        category = "Expert"
    elif score >= 70:
        category = "Advanced"
    elif score >= 50:
        category = "Intermediate"
    else:
        category = "Beginner"

    time_feedback = "Great timing!" if avg_time <= 10 else "Try to answer a bit faster next time."

    return category, time_feedback, round(accuracy, 2)

def store_results_in_csv(user_id, score_category, accuracy, streak, highest_difficulty, avg_time):
    filename = "quiz_results.csv"
    file_exists = os.path.isfile(filename)
    
    with open(filename, mode='a', newline='') as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(['User ID', 'Score Category', 'Accuracy', 'Streak', 'Highest Difficulty', 'Avg Time'])
        writer.writerow([user_id, score_category, accuracy, streak, highest_difficulty, avg_time])

def create_example_db(db_file):
    conn = create_connection(db_file)
    if conn is not None:
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS questions
                     (id INTEGER PRIMARY KEY, question TEXT, correct_answer TEXT, 
                     choice_1 TEXT, choice_2 TEXT, choice_3 TEXT, difficulty INTEGER)''')
        
        questions = [
            # Easy questions (difficulty 0)
            ("What is the capital of France?", "Paris", "London", "Berlin", "Madrid", 0),
            ("What is 2 + 2?", "4", "3", "5", "6", 0),
            ("What is the largest planet in our solar system?", "Jupiter", "Saturn", "Mars", "Earth", 0),
            ("What is the chemical symbol for water?", "H2O", "CO2", "NaCl", "O2", 0),
            ("Who painted the Mona Lisa?", "Leonardo da Vinci", "Vincent van Gogh", "Pablo Picasso", "Michelangelo", 0),
            ("What is the capital of Japan?", "Tokyo", "Beijing", "Seoul", "Bangkok", 0),
            ("What color is a banana?", "Yellow", "Red", "Green", "Blue", 0),
            ("How many continents are there?", "7", "5", "6", "8", 0),
            ("What is the largest mammal?", "Blue Whale", "Elephant", "Giraffe", "Hippopotamus", 0),
            ("What is the chemical symbol for gold?", "Au", "Ag", "Fe", "Cu", 0),

            # Medium questions (difficulty 1)
            ("Who wrote 'Romeo and Juliet'?", "William Shakespeare", "Charles Dickens", "Jane Austen", "Mark Twain", 1),
            ("What is the square root of 64?", "8", "6", "10", "12", 1),
            ("What is the capital of Australia?", "Canberra", "Sydney", "Melbourne", "Perth", 1),
            ("Who developed the theory of relativity?", "Albert Einstein", "Isaac Newton", "Stephen Hawking", "Niels Bohr", 1),
            ("What is the smallest prime number?", "2", "1", "3", "0", 1),
            ("What is the capital of Brazil?", "Brasília", "Rio de Janeiro", "São Paulo", "Salvador", 1),
            ("What is the boiling point of water in Celsius?", "100°C", "0°C", "50°C", "200°C", 1),
            ("Who wrote '1984'?", "George Orwell", "Aldous Huxley", "Ray Bradbury", "H.G. Wells", 1),
            ("What is the atomic number of carbon?", "6", "12", "8", "14", 1),
            ("Which planet is known as the Red Planet?", "Mars", "Venus", "Jupiter", "Mercury", 1),

            # Hard questions (difficulty 2)
            ("What is the speed of light?", "299,792,458 m/s", "300,000,000 m/s", "199,792,458 m/s", "250,000,000 m/s", 2),
            ("What is the longest river in the world?", "Nile", "Amazon", "Yangtze", "Mississippi", 2),
            ("Who discovered penicillin?", "Alexander Fleming", "Louis Pasteur", "Marie Curie", "Joseph Lister", 2),
            ("What is the chemical formula for sulfuric acid?", "H2SO4", "HCl", "NaOH", "CH3COOH", 2),
            ("In what year did the French Revolution begin?", "1789", "1776", "1804", "1815", 2),
            ("What is the largest known prime number (as of 2023)?", "2^82,589,933 - 1", "2^77,232,917 - 1", "2^43,112,609 - 1", "2^57,885,161 - 1", 2),
            ("What is the half-life of carbon-14?", "5,730 years", "1,000 years", "10,000 years", "50,000 years", 2),
            ("Who proposed the heliocentric model of the solar system?", "Nicolaus Copernicus", "Galileo Galilei", "Johannes Kepler", "Tycho Brahe", 2),
            ("What is the most abundant element in the universe?", "Hydrogen", "Helium", "Oxygen", "Carbon", 2),
            ("What is the Goldbach Conjecture?", "Every even integer greater than 2 can be expressed as the sum of two primes", "There are infinitely many prime numbers", "There is no largest prime number", "Every odd number is the sum of three primes", 2),
        ]
        
        c.executemany('INSERT INTO questions (question, correct_answer, choice_1, choice_2, choice_3, difficulty) VALUES (?,?,?,?,?,?)', questions)
        conn.commit()
        conn.close()
    else:
        print("Error! Cannot create the database connection.")

# Update the route to serve the React app
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/question', methods=['GET'])
def get_question():
    difficulty_level = int(request.args.get('difficulty', 0))
    conn = create_connection("questions_with_choices.db")
    question_data = fetch_question(conn, difficulty_level)
    conn.close()

    if question_data:
        question_id, question, correct_answer, choice_1, choice_2, choice_3, difficulty = question_data
        choices = [correct_answer, choice_1, choice_2, choice_3]
        random.shuffle(choices)
        return jsonify({
            'question': question,
            'choices': choices,
            'difficulty': difficulty
        })
    else:
        return jsonify({'error': 'No question available for this difficulty level'}), 404

@app.route('/api/check_answer', methods=['POST'])
def check_answer_api():
    data = request.json
    user_answer = data.get('answer')
    correct_answer = data.get('correct_answer')
    is_correct = check_answer(user_answer, correct_answer)
    return jsonify({'correct': is_correct})

@app.route('/api/submit_quiz', methods=['POST'])
def submit_quiz():
    data = request.json
    user_id = random.randint(1000, 9999)
    score_category, time_feedback, accuracy = calculate_score(
        data['streak'], data['total_questions'], data['correct_answers'],
        data['avg_time_per_question'], data['highest_difficulty']
    )
    store_results_in_csv(user_id, score_category, accuracy, data['streak'],
                         data['highest_difficulty'], data['avg_time_per_question'])
    
    return jsonify({
        'score_category': score_category,
        'time_feedback': time_feedback,
        'accuracy': accuracy,
        'user_id': user_id
    })

if __name__ == "__main__":
    db_file = "questions_with_choices.db"
    
    # Create a sample database with multiple-choice questions
    create_example_db(db_file)
    
    # Run the Flask app
    port = 5000  # Change to match the proxy in docs/package.json
    print(f"Attempting to start server on port {port}")
    app.run(debug=True, host='0.0.0.0', port=port, threaded=True)
# In this version of the app, we've added a few more API endpoints to handle quiz questions, answers, and results. The app now includes the following routes:
