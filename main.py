import sqlite3
import random
import time

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
    input_answer = input("Your answer: ").strip()
    elapsed_time = time.time() - start_time
    return input_answer, elapsed_time

# Main function to handle the quiz logic with multiple-choice
def quiz(conn):
    streak = 0
    difficulty_level = 0  # Start at the easiest level (0-10%)
    max_streak = 0
    
    while True:
        print(f"\nCurrent difficulty: {difficulty_level * 10}%-{(difficulty_level + 1) * 10}%")
        print(f"Current streak: {streak}, Highest streak: {max_streak}")
        
        # Fetch a question with multiple choice options
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
            print("Invalid selection.")
            continue
        
        # Check the answer
        if check_answer(user_answer, correct_answer):
            print(f"Correct! (Time taken: {response_time:.2f} seconds)")
            streak += 1
            max_streak = max(max_streak, streak)
            # Adjust difficulty more randomly
            difficulty_level = min(9, difficulty_level + random.choice([1, 2]))
        else:
            print(f"Incorrect! The correct answer was: {correct_answer}")
            streak = max(0, streak - 1)  # Decrease streak gently
            difficulty_level = max(0, difficulty_level - 1)
        
        # End or continue based on user input
        cont = input("Continue? (y/n): ").strip().lower()
        if cont != 'y':
            break

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
        # Easy questions (difficulty 0-1)
        ("What is the definition of misinformation?", "False or inaccurate information", "False news", "True news", "Propaganda", 0),
        ("What is the term for news stories that are intentionally misleading?", "Fake news", "Misinformation", "Propaganda", "Clickbait", 0),
        
        # Medium questions (difficulty 2-3)
        ("What is the Dunning-Kruger effect?", "A cognitive bias where people with low ability overestimate their ability", "A tendency to overestimate others' competence", "A method for estimating knowledge", "A way to improve skills", 2),
        ("Which fallacy occurs when one uses fear to influence an opinion?", "Appeal to fear", "Ad hominem", "Appeal to authority", "Red herring", 3),
        
        # Intermediate questions (difficulty 4-5)
        ("What is cognitive dexterity?", "The ability to think and react quickly and flexibly", "The ability to multitask", "Mental agility in physical tasks", "Quick problem solving", 4),
        ("What is cherry-picking in propaganda?", "Selecting only favorable evidence", "Presenting all evidence", "Ignoring contradictory evidence", "Appealing to emotions", 5),
        
        # Challenging questions (difficulty 6-7)
        ("What is the red herring fallacy?", "A distraction from the main issue", "An irrelevant conclusion", "A false cause", "Appeal to authority", 6),
        ("How does cognitive dissonance relate to belief perseverance?", "Holding conflicting beliefs while maintaining existing ones", "Quickly adapting to new information", "Resisting changes in belief systems", "Balancing between opposite opinions", 7),
        
        # Hard questions (difficulty 8-9)
        ("What is the bandwagon effect?", "Adopting beliefs because others do", "Being skeptical of common beliefs", "Choosing beliefs based on authority", "A group formed to debate ideas", 8),
        ("What is source amnesia?", "Forgetting where information was learned", "Misremembering facts", "Focusing only on important sources", "Relying on unverified sources", 9),
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
