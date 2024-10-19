import sqlite3
import random
import time
import csv
import os

# Create /csv subfolder if it doesn't exist
if not os.path.exists("csv"):
    os.makedirs("csv")

# Connect to database
def create_connection(db_file):
    conn = sqlite3.connect(db_file)
    return conn

# Fetch random question with multiple-choice options based on difficulty level
def fetch_question(conn, difficulty_level):
    cur = conn.cursor()
    cur.execute("SELECT id, question, correct_answer, choice_1, choice_2, choice_3 FROM questions WHERE difficulty_level = ?", (difficulty_level,))
    questions = cur.fetchall()
    
    if not questions:
        return None
    
    return random.choice(questions)

# Check if the user's answer is correct
def check_answer(user_answer, correct_answer):
    return user_answer.strip().lower() == correct_answer.strip().lower()

# Add a timer for responses
def timer():
    start_time = time.time()
    input_answer = input("Your answer (1-4): ").strip()
    elapsed_time = time.time() - start_time
    return input_answer, elapsed_time

# Calculate the user's final score based on streaks, accuracy, and difficulty progression
def calculate_score(streak, total_questions, correct_answers, avg_time_per_question, highest_difficulty):
    accuracy = (correct_answers / total_questions) * 100
    score_category = ""

    # Novice Category
    if accuracy <= 50 and highest_difficulty <= 3 and streak <= 2:
        score_category = "Novice"
    # Intermediate Category
    elif 51 <= accuracy <= 80 and highest_difficulty <= 7 and 3 <= streak <= 5:
        score_category = "Intermediate"
    # Expert Category
    elif accuracy > 80 and highest_difficulty > 7 and streak > 6:
        score_category = "Expert"

    # Additional feedback based on time per question
    if avg_time_per_question > 30:
        time_feedback = "You're taking a bit longer to respond. Try to build confidence and improve your speed."
    elif 15 <= avg_time_per_question <= 30:
        time_feedback = "You're answering at a consistent pace. Keep practicing to increase your speed."
    else:
        time_feedback = "Great speed! You're answering quickly and efficiently."

    return score_category, time_feedback, accuracy

# Store user results in CSV file
def store_results_in_csv(user_id, score_category, accuracy, streak, highest_difficulty, avg_time_per_question):
    csv_file = "csv/responses.csv"
    file_exists = os.path.isfile(csv_file)

    with open(csv_file, mode="a", newline="") as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(["ID#", "Score Category", "Accuracy (%)", "Max Streak", "Highest Difficulty", "Average Time Per Question (s)"])
        
        writer.writerow([user_id, score_category, f"{accuracy:.2f}", streak, highest_difficulty, f"{avg_time_per_question:.2f}"])

# Main function to handle the quiz logic with multiple-choice
def quiz(conn):
    streak = 0
    total_questions = 0
    correct_answers = 0
    total_time = 0
    difficulty_level = 0  # Start at the easiest level (0-10%)
    highest_difficulty = 0
    
    while True:
        print(f"\nCurrent difficulty: {difficulty_level * 10}%-{(difficulty_level + 1) * 10}%")
        print(f"Current streak: {streak}")
        
        # Fetch a question with multiple-choice options
        question_data = fetch_question(conn, difficulty_level)
        
        if not question_data:
            print("No questions available for this difficulty level.")
            break
        
        question_id, question, correct_answer, choice_1, choice_2, choice_3 = question_data
        
        # Present the question and choices
        print(f"Question: {question}")
        choices = [correct_answer, choice_1, choice_2, choice_3]
        random.shuffle(choices)  # Shuffle the order of choices
        for i, choice in enumerate(choices, 1):
            print(f"{i}. {choice}")
        
        # Get user's answer with timer
        user_choice, response_time = timer()
        
        try:
            user_answer = choices[int(user_choice) - 1]  # Get selected choice
        except (ValueError, IndexError):
            print("Invalid selection. Please choose a number between 1 and 4.")
            continue
        
        # Check the answer
        if check_answer(user_answer, correct_answer):
            print(f"Correct! (Time taken: {response_time:.2f} seconds)")
            streak += 1
            correct_answers += 1
        else:
            print(f"Incorrect! The correct answer was: {correct_answer}")
            streak = max(0, streak - 1)  # Decrease streak gently
        
        total_questions += 1
        total_time += response_time
        highest_difficulty = max(highest_difficulty, difficulty_level)

        # Adjust difficulty more randomly
        if correct_answers >= 1:
            difficulty_level = min(9, difficulty_level + random.choice([1, 2]))
        else:
            difficulty_level = max(0, difficulty_level - 1)
        
        # End or continue based on user input
        cont = input("Continue? (y/n): ").strip().lower()
        if cont != 'y':
            break
    
    if total_questions > 0:
        # Calculate average time per question
        avg_time_per_question = total_time / total_questions
        
        # Calculate final score
        score_category, time_feedback, accuracy = calculate_score(streak, total_questions, correct_answers, avg_time_per_question, highest_difficulty)
        
        # Assign a user ID and store results in CSV
        user_id = random.randint(1000, 9999)  # Randomly generated ID for now
        store_results_in_csv(user_id, score_category, accuracy, streak, highest_difficulty, avg_time_per_question)
        
        # Display final results
        print(f"\nYour performance is classified as: {score_category}")
        print(f"Your accuracy: {accuracy:.2f}%")
        print(f"Your max streak: {streak}")
        print(f"Your highest difficulty reached: {highest_difficulty}")
        print(f"Your average time per question: {avg_time_per_question:.2f} seconds")
        print(time_feedback)

# Example database creation for testing with multiple-choice questions
def create_example_db(db_file):
    conn = create_connection(db_file)
    cur = conn.cursor()
    
    # Create table with multiple-choice options
    cur.execute('''CREATE TABLE IF NOT EXISTS questions (
                        id INTEGER PRIMARY KEY,
                        question TEXT NOT NULL,
                        correct_answer TEXT NOT NULL,
                        choice_1 TEXT NOT NULL,
                        choice_2 TEXT NOT NULL,
                        choice_3 TEXT NOT NULL,
                        difficulty_level INTEGER NOT NULL
                   )''')
    
    # Insert some sample questions with different difficulty levels and choices
    questions = [
        ("What is the definition of misinformation?", "False or inaccurate information", "False news", "True news", "Propaganda", 0),
        ("What is the Dunning-Kruger effect?", "A cognitive bias where people with low ability overestimate their ability", "A tendency to overestimate others' competence", "A method for estimating knowledge", "A way to improve skills", 2),
        ("What is cherry-picking in propaganda?", "Selecting only favorable evidence", "Presenting all evidence", "Ignoring contradictory evidence", "Appealing to emotions", 4),
        ("What is the bandwagon effect?", "Adopting beliefs because others do", "Being skeptical of common beliefs", "Standing by personal beliefs", "Resisting popular opinions", 8),
    ]
    
    cur.executemany("INSERT INTO questions (question, correct_answer, choice_1, choice_2, choice_3, difficulty_level) VALUES (?, ?, ?, ?, ?, ?)", questions)
    conn.commit()
    conn.close()

if __name__ == "__main__":
    db_file = "questions_with_choices.db"
    
    # Create a sample database with multiple-choice questions
    create_example_db(db_file)
    
    # Connect to the database and start the quiz
    conn = create_connection(db_file)
    quiz(conn)
    conn.close()
