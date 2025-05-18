document.addEventListener('DOMContentLoaded', () => {
    const daySelect = document.getElementById('day-select');
    const trainingTypeSelect = document.getElementById('training-type');
    const generateWorkoutButton = document.getElementById('generate-workout');
    const workoutPlanDiv = document.getElementById('workout-plan');

    // User and Progress Log Elements
    const userNameInput = document.getElementById('user-name-input');
    const setUserButton = document.getElementById('set-user-button');
    const welcomeMessage = document.getElementById('welcome-message');
    const logWorkoutButton = document.getElementById('log-workout-button');
    const logDisplayArea = document.getElementById('log-display-area');

    let currentUserName = localStorage.getItem('fitnessAppUser') || '';
    let currentGeneratedWorkout = null; // To store the latest generated workout details

    function updateWelcomeMessage() {
        if (currentUserName) {
            welcomeMessage.textContent = `Welcome, ${currentUserName}! Let's track your progress.`;
            userNameInput.value = currentUserName;
            loadUserProgress();
        } else {
            welcomeMessage.textContent = 'Enter your name to personalize and save progress.';
        }
    }

    setUserButton.addEventListener('click', () => {
        const name = userNameInput.value.trim();
        if (name) {
            currentUserName = name;
            localStorage.setItem('fitnessAppUser', currentUserName);
            updateWelcomeMessage();
        } else {
            alert('Please enter a name.');
        }
    });

    // --- Workout Data ---
    // This is where we'll define the exercises.
    // We can expand this to include video links and science-based text later.
    const workouts = {
        bodybuilding: {
            chest: [
                {
                    name: "Barbell Bench Press",
                    sets: "4",
                    reps: "8-12",
                    videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg", // Jeff Nippard - How to Bench Press
                    description: "The barbell bench press is a fundamental compound exercise for developing the pectoralis major (chest), as well as the anterior deltoids (front shoulders) and triceps. Its ability to handle heavy loads makes it excellent for building upper body mass and strength."
                },
                {
                    name: "Incline Dumbbell Press",
                    sets: "3",
                    reps: "10-15",
                    videoUrl: "https://www.youtube.com/embed/8iPEnn-ltC8", // Athlean-X - Incline Dumbbell Press
                    description: "The incline dumbbell press targets the clavicular (upper) head of the pectoralis major more effectively than a flat press. Dumbbells allow for a greater range of motion and unilateral work, helping to address strength imbalances."
                },
                {
                    name: "Dumbbell Flyes",
                    sets: "3",
                    reps: "12-15",
                    videoUrl: "https://www.youtube.com/embed/eozdBNEHj3c", // ScottHermanFitness - Dumbbell Flys
                    description: "Dumbbell flyes are an isolation exercise that emphasizes the adduction function of the chest muscles, particularly good for stretching the pectoral fibers and promoting width. Focus on a controlled movement and feeling the stretch."
                },
                {
                    name: "Cable Crossovers",
                    sets: "3",
                    reps: "15-20",
                    videoUrl: "https://www.youtube.com/embed/omitcT3uVUI", // PictureFit - Cable Crossover
                    description: "Cable crossovers provide constant tension on the pectoral muscles throughout the entire range of motion, especially good for targeting the inner chest. The angle of the cables can be adjusted to target different areas of the chest."
                }
            ],
            back: [
                {
                    name: "Pull-ups (or Lat Pulldowns)",
                    sets: "4",
                    reps: "AMRAP or 8-12",
                    videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g", // Athlean-X - Pull-ups
                    description: "Pull-ups are a highly effective compound exercise for the latissimus dorsi (lats), biceps, and overall upper back. Lat pulldowns are a good alternative if pull-ups are too challenging, providing similar muscle activation."
                },
                {
                    name: "Barbell Rows",
                    sets: "4",
                    reps: "8-12",
                    videoUrl: "https://www.youtube.com/embed/kBWAon7ItDw", // Updated: Built With Science - How To PROPERLY Barbell Row
                    description: "Barbell rows are a cornerstone for back thickness, engaging the lats, rhomboids, middle and lower trapezius, and biceps. Maintaining a strict form is crucial to protect the lower back and maximize muscle engagement."
                },
                {
                    name: "Seated Cable Rows",
                    sets: "3",
                    reps: "10-15",
                    videoUrl: "https://www.youtube.com/embed/GZbfZ033f74", // ScottHermanFitness - Seated Cable Row
                    description: "Seated cable rows effectively target the middle back muscles (rhomboids, mid-traps) and lats. The controlled movement allows for a good mind-muscle connection and various grip attachments can alter the emphasis."
                },
                {
                    name: "Face Pulls",
                    sets: "3",
                    reps: "15-20",
                    videoUrl: "https://www.youtube.com/embed/rep-qVOkqgk", // Corrected: Athlean-X - PERFECT Face Pull
                    description: "Face pulls are crucial for shoulder health, targeting the rear deltoids and external rotators (infraspinatus, teres minor), which are often neglected. They help improve posture and prevent shoulder impingement."
                }
            ],
            legs: [
                {
                    name: "Barbell Squats",
                    sets: "4",
                    reps: "8-12",
                    videoUrl: "https://www.youtube.com/embed/Uv_DKDl7EjA", // Alan Thrall - How to Squat
                    description: "Barbell squats are a king of leg exercises, developing the quadriceps, hamstrings, glutes, and even engaging the core and lower back for stabilization. They are highly effective for overall leg strength and hypertrophy."
                },
                {
                    name: "Romanian Deadlifts (RDLs)",
                    sets: "3",
                    reps: "10-15",
                    videoUrl: "https://www.youtube.com/embed/JCXUYuzwNrM", // Megsquats - Romanian Deadlift
                    description: "RDLs primarily target the hamstrings and glutes, with secondary involvement of the lower back erectors. They are excellent for developing posterior chain strength and hamstring flexibility. Focus on hinging at the hips."
                },
                {
                    name: "Leg Press",
                    sets: "3",
                    reps: "12-15",
                    videoUrl: "https://www.youtube.com/embed/sEMarc3VqD0", // ScottHermanFitness - Leg Press
                    description: "The leg press allows for heavy loading of the quadriceps, hamstrings, and glutes with less strain on the lower back compared to squats. Foot placement can alter muscle emphasis (higher for glutes/hams, lower for quads)."
                },
                {
                    name: "Leg Extensions",
                    sets: "3",
                    reps: "15-20",
                    videoUrl: "https://www.youtube.com/embed/YyvSfVjQeL0", // Built with Science - Leg Extension
                    description: "Leg extensions are an isolation exercise for the quadriceps. They are effective for targeting the different heads of the quads (vastus medialis, lateralis, intermedius, and rectus femoris) and achieving a good pump."
                },
                {
                    name: "Hamstring Curls",
                    sets: "3",
                    reps: "15-20",
                    videoUrl: "https://www.youtube.com/embed/1Tq3QdYUHBg", // Corrected: ScottHermanFitness - Lying Leg Curl
                    description: "Hamstring curls (lying, seated, or standing) isolate the hamstring muscles (biceps femoris, semitendinosus, semimembranosus). They are important for knee flexion strength and balancing quad development."
                },
                {
                    name: "Calf Raises",
                    sets: "4",
                    reps: "15-25",
                    videoUrl: "https://www.youtube.com/embed/JbyjNymZOt0", // Athlean-X - Calf Raise
                    description: "Calf raises target the gastrocnemius and soleus muscles of the lower leg. Standing versions emphasize the gastrocnemius, while seated versions target the soleus more directly. High reps are often effective."
                }
            ],
            shoulders: [
                {
                    name: "Overhead Press (Barbell or Dumbbell)",
                    sets: "4",
                    reps: "8-12",
                    videoUrl: "https://www.youtube.com/embed/2yjwXTZQDDI", // Alan Thrall - Overhead Press
                    description: "The Overhead Press (OHP) is a primary compound movement for developing the deltoids (especially anterior and medial heads), triceps, and upper trapezius. It's a great builder of overall upper body pressing strength."
                },
                {
                    name: "Lateral Raises",
                    sets: "3",
                    reps: "12-15",
                    videoUrl: "https://www.youtube.com/embed/3VcKaXpzqRo", // Jeff Nippard - Lateral Raise
                    description: "Lateral raises isolate the medial (side) head of the deltoid, which is key for developing shoulder width. Proper form with controlled movement is crucial to avoid momentum and maximize tension on the muscle."
                },
                {
                    name: "Front Raises",
                    sets: "3",
                    reps: "12-15",
                    videoUrl: "https://www.youtube.com/embed/s-t0jA_N9G0", // ScottHermanFitness - Front Raise
                    description: "Front raises target the anterior (front) head of the deltoid. While the front delts get work from pressing movements, front raises can provide additional focused volume for development."
                },
                {
                    name: "Reverse Pec Deck (or Bent-over Dumbbell Flyes)",
                    sets: "3",
                    reps: "15-20",
                    videoUrl: "https://www.youtube.com/embed/H5gZgG2gX6Y", // Built with Science - Reverse Pec Deck
                    description: "Reverse pec deck or bent-over dumbbell flyes target the posterior (rear) deltoids and muscles of the upper back like the rhomboids and middle traps. Essential for shoulder health and a balanced physique."
                }
            ],
            arms: [
                {
                    name: "Barbell Curls",
                    sets: "3",
                    reps: "8-12",
                    videoUrl: "https://www.youtube.com/embed/kwG2ipFRgfo", // Athlean-X - Barbell Curl
                    description: "Barbell curls are a classic mass builder for the biceps brachii, also engaging the brachialis and brachioradialis. Allows for heavy weight to stimulate growth."
                },
                {
                    name: "Triceps Dips (or Close-Grip Bench Press)",
                    sets: "3",
                    reps: "8-12",
                    videoUrl: "https://www.youtube.com/embed/6MxlhWqP4jo", // Jeff Nippard - Dips for Triceps
                    description: "Triceps dips are a compound movement that heavily targets all three heads of the triceps. Close-grip bench press is another excellent compound alternative for triceps mass."
                },
                {
                    name: "Dumbbell Hammer Curls",
                    sets: "3",
                    reps: "10-15",
                    videoUrl: "https://www.youtube.com/embed/zC3nLH_LAPE", // ScottHermanFitness - Hammer Curl
                    description: "Hammer curls, with a neutral grip, emphasize the brachialis and brachioradialis muscles of the arm, contributing to overall arm thickness and forearm development."
                },
                {
                    name: "Overhead Dumbbell Extension",
                    sets: "3",
                    reps: "10-15",
                    videoUrl: "https://www.youtube.com/embed/YbX7WdY6e_0", // Built with Science - Overhead Tricep Extension
                    description: "Overhead dumbbell extensions target the long head of the triceps effectively due to the shoulder being in a flexed position, which stretches the long head."
                },
                {
                    name: "Cable Pushdowns",
                    sets: "3",
                    reps: "12-15",
                    videoUrl: "https://www.youtube.com/embed/2-LAMcpzODU", // Jeff Nippard - Tricep Pushdown
                    description: "Cable pushdowns are an isolation exercise for the triceps, particularly effective for the lateral and medial heads. Various attachments (rope, bar) can be used to alter the feel."
                },
                {
                    name: "Concentration Curls",
                    sets: "3",
                    reps: "12-15",
                    videoUrl: "https://www.youtube.com/embed/0AUGkch3tzc", // Athlean-X - Concentration Curl
                    description: "Concentration curls are a strict isolation exercise for the biceps, designed to maximize peak contraction by minimizing momentum and involvement of other muscle groups."
                }
            ],
            fullbody: [
                { name: "Squats", sets: "3", reps: "8-12", videoUrl: "https://www.youtube.com/embed/Uv_DKDl7EjA", description: "Full body squats engage major muscle groups including quads, hamstrings, glutes, and core, promoting overall strength and muscle growth." },
                { name: "Bench Press", sets: "3", reps: "8-12", videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg", description: "The bench press is key for upper body strength, targeting the chest, shoulders, and triceps. It's a staple in many full-body routines." },
                { name: "Deadlifts", sets: "1", reps: "5", videoUrl: "https://www.youtube.com/embed/op9kVnSso6Q", description: "Deadlifts are a total-body exercise, strengthening the posterior chain (hamstrings, glutes, back) as well as the core, traps, and forearms. Performed with lower reps in full-body context for intensity." },
                { name: "Overhead Press", sets: "3", reps: "8-12", videoUrl: "https://www.youtube.com/embed/2yjwXTZQDDI", description: "The overhead press builds shoulder strength and size, also working the triceps and upper chest. A fundamental movement for upper body power." },
                { name: "Rows (Barbell or Dumbbell)", sets: "3", reps: "8-12", videoUrl: "https://www.youtube.com/embed/RquD0AYj0v4", description: "Rows target the major muscles of the back including lats, rhomboids, and traps, crucial for posture and balanced upper body development." }
            ]
        },
        powerlifting: {
            chest: [ // Often part of an "Upper Body" day focusing on Bench Press
                { name: "Barbell Bench Press", sets: "5", reps: "5 (heavy)", videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg", description: "The primary powerlifting movement for chest. Focus is on moving maximum weight for lower reps, building raw strength in chest, shoulders, and triceps." },
                { name: "Close-Grip Bench Press", sets: "3", reps: "6-8", videoUrl: "https://www.youtube.com/embed/nEF0bv2FW94", description: "A bench press variation that places more emphasis on the triceps and inner chest. Builds triceps strength crucial for locking out heavy benches." },
                { name: "Paused Bench Press", sets: "3", reps: "3-5", videoUrl: "https://www.youtube.com/embed/1mPM9scyItU", description: "Involves pausing the bar on the chest, which eliminates momentum and builds strength from a dead stop. Improves control and power at the bottom of the lift." },
                { name: "Triceps Pushdowns", sets: "3", reps: "8-12", videoUrl: "https://www.youtube.com/embed/2-LAMcpzODU", description: "Accessory exercise to build triceps volume and strength, supporting a stronger bench press lockout." }
            ],
            back: [ // Often part of a "Deadlift/Back" day
                { name: "Deadlifts (Conventional or Sumo)", sets: "1-3", reps: "1-5 (heavy, work up to top set)", videoUrl: "https://www.youtube.com/embed/op9kVnSso6Q", description: "A core powerlifting lift, testing overall strength. Engages nearly every muscle, primarily posterior chain (hamstrings, glutes, entire back). Sumo and Conventional are two main stances." },
                { name: "Barbell Rows", sets: "4", reps: "6-10", videoUrl: "https://www.youtube.com/embed/RquD0AYj0v4", description: "Builds back thickness and strength supportive of deadlifts and overall stability. Heavier weight and slightly lower reps than bodybuilding style." },
                { name: "Good Mornings", sets: "3", reps: "8-12", videoUrl: "https://www.youtube.com/embed/vKPqcsW_1Cg", description: "Strengthens the lower back, hamstrings, and glutes. Excellent for building posterior chain strength that carries over to squats and deadlifts." },
                { name: "Lat Pulldowns", sets: "3", reps: "8-12", videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g", description: "Accessory exercise for lat development, contributing to a stronger and more stable upper back for all lifts." }
            ],
            legs: [ // Often a "Squat" day
                { name: "Barbell Squats (High Bar or Low Bar)", sets: "5", reps: "5 (heavy)", videoUrl: "https://www.youtube.com/embed/Uv_DKDl7EjA", description: "The primary powerlifting movement for legs. Focus on maximal weight for lower reps. High bar and low bar positions alter mechanics and muscle emphasis slightly." },
                { name: "Front Squats", sets: "3", reps: "5-8", videoUrl: "https://www.youtube.com/embed/Y2wAl3ekS4E", description: "A squat variation that emphasizes quadriceps and upper back strength. Requires core stability and helps improve posture under load." },
                { name: "Pause Squats", sets: "3", reps: "3-5", videoUrl: "https://www.youtube.com/embed/vm0XIc2xHSc", description: "Involves pausing at the bottom of the squat, building strength out of the hole and improving control and stability. Excellent for overcoming sticking points." },
                { name: "Hamstring Curls", sets: "3", reps: "8-12", videoUrl: "https://www.youtube.com/embed/1Tq3QdYUHBg", description: "Accessory exercise for hamstring development, contributing to knee stability and pulling strength in deadlifts." }
            ],
             shoulders: [ // Accessory for bench day
                { name: "Overhead Press", sets: "4", reps: "5-8", videoUrl: "https://www.youtube.com/embed/2yjwXTZQDDI", description: "Builds shoulder and triceps strength, which is supportive of the bench press. Performed with a focus on strength in the 5-8 rep range." },
                { name: "Face Pulls", sets: "3", reps: "10-15", videoUrl: "https://www.youtube.com/embed/rep-qVOkqgk", description: "Important for shoulder health, balancing out pressing movements by strengthening rear delts and external rotators." },
                { name: "Lateral Raises", sets: "3", reps: "10-15", videoUrl: "https://www.youtube.com/embed/3VcKaXpzqRo", description: "Accessory for medial deltoid development, contributing to shoulder stability and overall aesthetics." }
            ],
            arms: [ // Accessory, less focus in powerlifting
                { name: "Barbell Curls", sets: "3", reps: "8-10", videoUrl: "https://www.youtube.com/embed/kwG2ipFRgfo", description: "General bicep work, can help with elbow health and stability during heavy pressing and pulling." },
                { name: "Skullcrushers", sets: "3", reps: "8-10", videoUrl: "https://www.youtube.com/embed/Nggo1MCEiV0", description: "Triceps isolation exercise to build strength and mass, supporting lockout in bench press and OHP." }
            ],
            fullbody: [ // Classic 3-day splits like Starting Strength or StrongLifts 5x5 often use this structure
                { name: "Day 1: Squat Focus", details: "Squat (e.g., 5x5), Bench Press (e.g., 5x5), Barbell Row (e.g., 5x5). Video links and descriptions would be for each specific lift.", videoUrl: "https://www.youtube.com/embed/Uv_DKDl7EjA", description: "Focus on mastering compound lifts. Squats for lower body and core, Bench for upper body push, Rows for upper body pull."},
                { name: "Day 2: Rest or Light Activity", details: "Active recovery like walking or stretching is beneficial." , description: "Rest is crucial for muscle recovery and growth in powerlifting."},
                { name: "Day 3: Deadlift Focus", details: "Deadlift (e.g., 1x5), Overhead Press (e.g., 5x5), Pull-ups (e.g., 3xAMRAP).", videoUrl: "https://www.youtube.com/embed/op9kVnSso6Q", description: "Deadlifts build overall strength. Overhead Press for vertical pushing. Pull-ups for vertical pulling."},
                { name: "Day 4: Rest or Light Activity", details: "Focus on mobility or light cardio.", description: "Continued recovery and preparation for the next heavy session."},
                { name: "Day 5: Bench Focus", details: "Bench Press (e.g., 5x5, can be a variation or different intensity), Squat (e.g., 3x5, often lighter), Accessory exercises.", videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg", description: "Another opportunity to drive bench press progress, with squats at a lighter intensity to maintain technique and volume."}
            ]
        },
        strongman: { // Focus on compound movements and events - videos will be more event-specific
            chest: [ // Usually trained with shoulders/pressing movements
                { name: "Log Press (or Axle Press)", sets: "5", reps: "3-5 (working up)", videoUrl: "https://www.youtube.com/embed/uXGjH7qA0cM", description: "A staple strongman overhead pressing event. The log's neutral grip and awkwardness build unique pressing strength, targeting shoulders, triceps, and chest." },
                { name: "Incline Bench Press", sets: "3", reps: "6-8", videoUrl: "https://www.youtube.com/embed/8iPEnn-ltC8", description: "Builds upper chest and shoulder strength, useful as an accessory for overhead pressing events in strongman." },
                { name: "Weighted Dips", sets: "3", reps: "AMRAP", videoUrl: "https://www.youtube.com/embed/6MxlhWqP4jo", description: "Develops pressing power in the chest, shoulders, and triceps. AMRAP (As Many Reps As Possible) builds muscular endurance and strength." }
            ],
            back: [ // Crucial for deadlifts and carries
                { name: "Axle Deadlifts (or Conventional/Sumo)", sets: "Varies", reps: "Work up to a heavy single/triple", videoUrl: "https://www.youtube.com/embed/zGrGkSAHjKk", description: "Deadlifts with an axle bar (thicker, no knurling) heavily challenge grip strength in addition to the posterior chain. Conventional/Sumo are stance options." },
                { name: "Heavy Barbell Rows (Pendlay or Kroc Rows)", sets: "4", reps: "6-10", videoUrl: "https://www.youtube.com/embed/RquD0AYj0v4", description: "Builds a powerful upper back necessary for stabilizing heavy loads in carries and deadlifts. Kroc rows are high-rep dumbbell rows emphasizing grip and back strength." },
                { name: "Farmers Walk", sets: "3-4", reps: "For distance/time", videoUrl: "https://www.youtube.com/embed/PAYS8L23LEC", description: "A classic strongman event developing grip strength, core stability, upper back strength, and endurance. Involves carrying heavy implements over a set distance." },
                { name: "Tire Flips", sets: "Varies", reps: "Number of flips or for time", videoUrl: "https://www.youtube.com/embed/Oudj2k1n9qI", description: "A full-body explosive movement that builds power, conditioning, and strength in the legs, hips, back, and arms. Technique is crucial to avoid injury." }
            ],
            legs: [
                { name: "Yoke Walk", sets: "3-4", reps: "For distance/time (heavy)", videoUrl: "https://www.youtube.com/embed/9xQp22n8mKo", description: "Involves carrying a heavy yoke on the back, testing core strength, leg power, and stability. A brutal but effective full-body and mental conditioner." },
                { name: "Squats (Safety Bar, Zercher, or Barbell)", sets: "4", reps: "5-8", videoUrl: "https://www.youtube.com/embed/VNVj85wS_X4", description: "Strongman often uses squat variations like Safety Bar Squats (easier on shoulders, more upper back focus) or Zercher Squats (anterior load, massive core engagement)." },
                { name: "Stone Loading (Atlas Stones or Sandbags)", sets: "Varies", reps: "Number of loads or to height", videoUrl: "https://www.youtube.com/embed/0n3yC9HfqgY", description: "Loading heavy, awkward objects like Atlas Stones or sandbags to a platform builds explosive power, back strength, and grip. A hallmark of strongman." },
                { name: "Sled Drags/Pushes", sets: "3-4", reps: "For distance", videoUrl: "https://www.youtube.com/embed/LkmjDEhEnvE", description: "Excellent for building leg drive, conditioning, and mental toughness with minimal eccentric loading, allowing for frequent training." }
            ],
            shoulders: [ // Often the primary focus in strongman pressing
                { name: "Overhead Press (Axle, Log, Dumbbell)", sets: "5", reps: "3-5 (working up)", videoUrl: "https://www.youtube.com/embed/0RMp242mI1A", description: "Overhead pressing is a key component of strongman. Axle and Log presses are common event variations, building raw shoulder and triceps power." },
                { name: "Viking Press", sets: "3", reps: "8-12", videoUrl: "https://www.youtube.com/embed/7gSYT9J2_Yg", description: "A machine-based or lever-based overhead press that allows for high repetitions, building shoulder hypertrophy and endurance specific to pressing." },
                { name: "Lateral Raises (Heavy)", sets: "3", reps: "10-15", videoUrl: "https://www.youtube.com/embed/3VcKaXpzqRo", description: "While strongman focuses on compounds, heavy lateral raises can build medial deltoid strength and size, contributing to pressing stability." },
                { name: "Face Pulls", sets: "3", reps: "15-20", videoUrl: "https://www.youtube.com/embed/rep-qVOkqgk", description: "Crucial for shoulder health to balance heavy pressing, strengthening rear delts and external rotators." }
            ],
            arms: [ // Mostly hit through compound movements, but some direct work can be included
                { name: "Strict Curls (Thick Bar if possible)", sets: "3", reps: "6-10", videoUrl: "https://www.youtube.com/embed/kwG2ipFRgfo", description: "Builds bicep strength. Using a thick bar (axle) will also heavily recruit forearm and grip strength, beneficial for many strongman events." },
                { name: "Close Grip Log Press", sets: "3", reps: "6-10", videoUrl: "https://www.youtube.com/embed/uXGjH7qA0cM", description: "Performing log presses with a closer grip can shift more emphasis to the triceps, building pressing power specific to the implement." } // Note: Same video as general log press, technique detail.
            ],
            fullbody: [ // Event training days or general conditioning (GPP)
                { name: "Event Medley 1", details: "Example: Yoke Walk -> Farmers Carry -> Sandbag Load over bar. Focus on transitions and speed.", videoUrl: "https://www.youtube.com/embed/tDS1P7yzafI", description: "Medleys combine multiple strongman events in sequence, testing overall conditioning, strength-endurance, and mental fortitude." },
                { name: "Event Medley 2", details: "Example: Tire Flip -> Sled Drag -> Stone Over Bar. Vary events to cover different strengths.", videoUrl: "https://www.youtube.com/embed/xTireS5ak2Q", description: "Another example of an event medley, crucial for simulating competition conditions and building work capacity." },
                { name: "Heavy Compound Lift", details: "e.g., Max Deadlift or Squat variation, or a heavy Log Press attempt. Focus on a single heavy lift.", videoUrl: "https://www.youtube.com/embed/op9kVnSso6Q", description: "Dedicated days or parts of sessions for pushing maximal strength on key compound lifts that are either events themselves or highly transferable." }
            ]
        }
    };

    function addWorkoutCustomizationListeners() {
        // Delete buttons
        document.querySelectorAll('.delete-exercise-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const exerciseIndex = parseInt(e.target.getAttribute('data-index'));
                currentGeneratedWorkout.exercises.splice(exerciseIndex, 1); // Remove from data
                // Re-render the workout display part to reflect deletion and re-index
                const day = daySelect.value; // Need current selections to re-filter if needed
                const trainingType = trainingTypeSelect.value;
                // Temporarily store notes as they are not part of initial workout data.
                const currentNotes = [];
                workoutPlanDiv.querySelectorAll('textarea[data-exercise-index]').forEach(ta => {
                    currentNotes[parseInt(ta.getAttribute('data-exercise-index'))] = ta.value;
                });

                // Regenerate the list based on the modified currentGeneratedWorkout
                // This is a bit of a blunt way but ensures correct re-indexing and display
                displayGeneratedWorkout(); 
            });
        });

        // Editable sets
        document.querySelectorAll('.editable-set').forEach(input => {
            input.addEventListener('change', (e) => { // 'change' event is better than 'input' for discrete updates
                const exerciseIndex = parseInt(e.target.getAttribute('data-index'));
                currentGeneratedWorkout.exercises[exerciseIndex].sets = e.target.value;
            });
        });

        // Editable reps
        document.querySelectorAll('.editable-rep').forEach(input => {
            input.addEventListener('change', (e) => {
                const exerciseIndex = parseInt(e.target.getAttribute('data-index'));
                currentGeneratedWorkout.exercises[exerciseIndex].reps = e.target.value;
            });
        });
    }

    // New function to encapsulate displaying the generated workout to be callable after modification
    function displayGeneratedWorkout() {
        workoutPlanDiv.innerHTML = ''; // Clear previous display
        if (!currentGeneratedWorkout || !currentGeneratedWorkout.exercises || currentGeneratedWorkout.exercises.length === 0) {
            workoutPlanDiv.innerHTML = '<p>Workout cleared or no exercises.</p>';
            logWorkoutButton.style.display = 'none';
            return;
        }

        const ul = document.createElement('ul');
        currentGeneratedWorkout.exercises.forEach((exercise, index) => {
            const li = document.createElement('li');
            li.setAttribute('data-exercise-id', index);
            
            let exerciseHTML = `<strong>${exercise.name}</strong>`;
            if (exercise.hasOwnProperty('sets')) {
                exerciseHTML += `: <input type="text" class="editable-set" value="${exercise.sets}" size="3" data-index="${index}"> sets of `;
                exerciseHTML += `<input type="text" class="editable-rep" value="${exercise.reps}" size="5" data-index="${index}"> reps`;
            } else if (exercise.details) {
                 exerciseHTML += `: ${exercise.details}`;
            }

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-exercise-button');
            deleteButton.setAttribute('data-index', index);
            deleteButton.style.cssText = 'margin-left: 10px; padding: 2px 5px; font-size: 0.8em; background-color: #dc3545; color: white; border: none; border-radius: 3px;';

            const exerciseInfoSpan = document.createElement('span');
            exerciseInfoSpan.innerHTML = exerciseHTML;
            
            li.appendChild(exerciseInfoSpan);
            li.appendChild(deleteButton);

            if (exercise.description) {
                const descP = document.createElement('p');
                descP.classList.add('exercise-description');
                descP.textContent = exercise.description;
                li.appendChild(descP);
            }

            if (exercise.videoUrl) {
                const videoDiv = document.createElement('div');
                videoDiv.classList.add('exercise-video-container');
                const iframe = document.createElement('iframe');
                iframe.setAttribute('width', '100%'); 
                iframe.setAttribute('height', '315');
                iframe.setAttribute('src', exercise.videoUrl);
                iframe.setAttribute('title', `${exercise.name} video`);
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                iframe.setAttribute('allowfullscreen', '');
                videoDiv.appendChild(iframe);
                li.appendChild(videoDiv);
            }

            const notesLabel = document.createElement('label');
            notesLabel.textContent = ' Notes for this exercise: ';
            notesLabel.style.cssText = 'font-weight: bold; margin-top: 10px; display: block;';
            const notesTextarea = document.createElement('textarea');
            notesTextarea.setAttribute('data-exercise-index', index);
            notesTextarea.style.cssText = 'width: 98%; margin-top: 5px;';
            notesTextarea.placeholder = 'e.g., Weight used, how it felt, reps achieved...';
            notesTextarea.value = exercise.notes || ''; // Populate with existing notes if any
            li.appendChild(notesLabel);
            li.appendChild(notesTextarea);
            
            ul.appendChild(li);
        });
        workoutPlanDiv.appendChild(ul);
        logWorkoutButton.style.display = 'block';
        addWorkoutCustomizationListeners(); // Re-attach listeners to new elements
    }

    // Modify the original generateWorkout function to use displayGeneratedWorkout
    // The main change is that generateWorkout now *builds* currentGeneratedWorkout
    // and then calls displayGeneratedWorkout() to render it.

    function generateWorkout() {
        const day = daySelect.value;
        const trainingType = trainingTypeSelect.value;
        const selectedWorkoutData = workouts[trainingType]?.[day];

        if (selectedWorkoutData && selectedWorkoutData.length > 0) {
            currentGeneratedWorkout = {
                date: new Date().toLocaleDateString(),
                day: daySelect.options[daySelect.selectedIndex].text,
                trainingType: trainingTypeSelect.options[trainingTypeSelect.selectedIndex].text,
                exercises: selectedWorkoutData.map(ex => ({ ...ex, notes: '' }))
            };
            displayGeneratedWorkout(); // Call the new display function
        } else {
            workoutPlanDiv.innerHTML = '<p>No workout defined for this combination. Select other options or we can add it!</p>';
            logWorkoutButton.style.display = 'none';
            currentGeneratedWorkout = null;
        }
    }

    generateWorkoutButton.addEventListener('click', generateWorkout);

    logWorkoutButton.addEventListener('click', () => {
        if (!currentUserName) {
            alert('Please set your name first to log workouts.');
            userNameInput.focus();
            return;
        }
        if (!currentGeneratedWorkout) {
            alert('No workout generated to log.');
            return;
        }

        // Capture notes from textareas
        const noteTextareas = workoutPlanDiv.querySelectorAll('textarea[data-exercise-index]');
        noteTextareas.forEach(textarea => {
            const exerciseIndex = parseInt(textarea.getAttribute('data-exercise-index'));
            currentGeneratedWorkout.exercises[exerciseIndex].notes = textarea.value.trim();
        });

        const logs = JSON.parse(localStorage.getItem(currentUserName + '_workoutLogs')) || [];
        logs.unshift(currentGeneratedWorkout); // Add to the beginning for chronological order (newest first)
        localStorage.setItem(currentUserName + '_workoutLogs', JSON.stringify(logs));
        alert('Workout logged successfully!');
        loadUserProgress();
        currentGeneratedWorkout = null; // Reset after logging
        logWorkoutButton.style.display = 'none';
        // Optionally clear the workout display or keep it
    });

    function loadUserProgress() {
        if (!currentUserName) return;

        const logs = JSON.parse(localStorage.getItem(currentUserName + '_workoutLogs')) || [];
        logDisplayArea.innerHTML = ''; // Clear previous logs

        if (logs.length === 0) {
            logDisplayArea.innerHTML = '<p>No workouts logged yet. Generate and log a workout!</p>';
            return;
        }

        const h3 = document.createElement('h3');
        h3.textContent = `${currentUserName}'s Logged Workouts:`;
        logDisplayArea.appendChild(h3);

        logs.forEach(log => {
            const logEntryDiv = document.createElement('div');
            logEntryDiv.classList.add('log-entry');
            logEntryDiv.innerHTML = `
                <h4>Workout on: ${log.date}</h4>
                <p><strong>Day:</strong> ${log.day}</p>
                <p><strong>Training Style:</strong> ${log.trainingType}</p>
                <h5>Exercises:</h5>
            `;
            const exercisesUl = document.createElement('ul');
            log.exercises.forEach(ex => {
                const exLi = document.createElement('li');
                exLi.innerHTML = `<strong>${ex.name}</strong>: ${ex.sets || 'N/A'} sets of ${ex.reps || 'N/A'} reps`;
                if (ex.notes) {
                    const notesP = document.createElement('p');
                    notesP.style.fontStyle = 'italic';
                    notesP.style.marginLeft = '15px';
                    notesP.textContent = `Notes: ${ex.notes}`;
                    exLi.appendChild(notesP);
                }
                exercisesUl.appendChild(exLi);
            });
            logEntryDiv.appendChild(exercisesUl);
            logDisplayArea.appendChild(logEntryDiv);
        });
    }

    // Initial setup
    updateWelcomeMessage(); // Load user if already set and display progress

    // --- 1RM Calculator --- 
    const weightLiftedInput = document.getElementById('weight-lifted');
    const repsPerformedInput = document.getElementById('reps-performed');
    const calculate1rmButton = document.getElementById('calculate-1rm-button');
    const oneRmResultP = document.getElementById('onerm-result');

    calculate1rmButton.addEventListener('click', () => {
        const weight = parseFloat(weightLiftedInput.value);
        const reps = parseInt(repsPerformedInput.value);

        if (isNaN(weight) || isNaN(reps) || weight <= 0 || reps <= 0) {
            oneRmResultP.textContent = 'Please enter valid positive numbers for weight and reps.';
            oneRmResultP.style.color = 'red';
            return;
        }
        if (reps === 1) {
             oneRmResultP.textContent = `Your estimated 1RM is: ${weight.toFixed(2)} (Same as weight lifted for 1 rep).`;
             oneRmResultP.style.color = 'green';
             return;
        }
        if (reps > 12) { // Epley formula is less accurate for very high reps
            oneRmResultP.textContent = 'Note: 1RM estimation is less accurate for reps > 12.';
            oneRmResultP.style.color = 'orange';
        } else {
            oneRmResultP.style.color = 'green'; // Reset color if previously orange or red
        }

        // Epley formula: 1RM = weight * (1 + reps / 30)
        const estimated1RM = weight * (1 + reps / 30);
        const currentText = oneRmResultP.textContent; // Preserve high-rep warning if present
        oneRmResultP.textContent = (currentText.startsWith('Note:') ? currentText + ' ' : '') + `Estimated 1RM: ${estimated1RM.toFixed(2)}`;
    });

    // --- Rest Timer --- 
    const restTimeInput = document.getElementById('rest-time-input');
    const timerDisplay = document.getElementById('timer-display');
    const startTimerButton = document.getElementById('start-timer-button');
    const pauseTimerButton = document.getElementById('pause-timer-button');
    const resetTimerButton = document.getElementById('reset-timer-button');

    let timerInterval = null;
    let timeLeft = 0;
    let initialTime = 0;
    let isTimerPaused = false;

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    function updateTimerDisplay() {
        timerDisplay.textContent = formatTime(timeLeft);
    }

    startTimerButton.addEventListener('click', () => {
        if (timerInterval) return; // Already running or paused with time left

        if (isTimerPaused && timeLeft > 0) {
            isTimerPaused = false;
        } else {
            initialTime = parseInt(restTimeInput.value);
            if (isNaN(initialTime) || initialTime <= 0) {
                alert('Please enter a valid rest time in seconds.');
                return;
            }
            timeLeft = initialTime;
            isTimerPaused = false;
        }
        
        updateTimerDisplay(); // Show initial time immediately

        timerInterval = setInterval(() => {
            if (!isTimerPaused) {
                timeLeft--;
                updateTimerDisplay();
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    timerInterval = null;
                    timerDisplay.textContent = "Time's up!";
                    // Optional: Play a sound
                    // const audio = new Audio('path/to/sound.mp3'); // Needs a sound file
                    // audio.play();
                }
            }
        }, 1000);
    });

    pauseTimerButton.addEventListener('click', () => {
        if (timerInterval && timeLeft > 0) {
            isTimerPaused = true;
            // Note: We don't clear the interval here, just pause its effect.
            // To truly pause setInterval, you clear it and then restart with remaining time.
            // For simplicity, this model effectively pauses the countdown logic within the interval.
            // A more robust pause would clear and then allow resume.
            // Let's refine this to a true pause:
            clearInterval(timerInterval);
            timerInterval = null; // Indicate timer is not actively counting down via an interval
        } 
    });

    resetTimerButton.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
        isTimerPaused = false;
        initialTime = parseInt(restTimeInput.value) || 60;
        timeLeft = initialTime;
        updateTimerDisplay();
    });

    // Initialize timer display
    timeLeft = parseInt(restTimeInput.value) || 60;
    updateTimerDisplay();

    // --- Motivational Quotes ---
    const quoteTextElement = document.getElementById('quote-text');
    const quoteAuthorElement = document.getElementById('quote-author');

    const motivationalQuotes = [
        { text: "The last three or four reps is what makes the muscle grow. This area of pain divides the champion from someone else who is not a champion.", author: "Arnold Schwarzenegger" },
        { text: "Everybody wants to be a bodybuilder, but nobody wants to lift no heavy-ass weights.", author: "Ronnie Coleman" },
        { text: "If you always put limits on everything you do, physical or anything else, it will spread into your work and into your life. There are no limits. There are only plateaus, and you must not stay there, you must go beyond them.", author: "Bruce Lee" },
        { text: "The mind is the limit. As long as the mind can envision the fact that you can do something, you can do it, as long as you really believe 100 percent.", author: "Arnold Schwarzenegger" },
        { text: "There is no substitute for hard work. Always be humble and hungry.", author: "Dwayne 'The Rock' Johnson" },
        { text: "Strength does not come from winning. Your struggles develop your strengths. When you go through hardships and decide not to surrender, that is strength.", author: "Arnold Schwarzenegger" },
        { text: "To be a champion, you must believe in yourself when nobody else will.", author: "Sugar Ray Robinson" }, // General athletic quote, applicable
        { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
        { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" }, // General success quote
        { text: "Light weight, baby!", author: "Ronnie Coleman" },
        { text: "There are no shortcuts—everything is reps, reps, reps.", author: "Arnold Schwarzenegger" },
        { text: "Don't be afraid of failure. This is the way to succeed.", author: "LeBron James" }, // General athletic
        { text: "Obsessed is a word the lazy use to describe the dedicated.", author: "Unknown, widely used in fitness" },
        { text: "Your body can stand almost anything. It's your mind that you have to convince.", author: "Unknown, widely used in fitness" },
        { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown, widely used in fitness" },
        { text: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon" }, // General success
        { text: "I don't count my sit-ups. I only start counting when it starts hurting.", author: "Muhammad Ali" },
        { text: "It's not about having time. It's about making time.", author: "Unknown"},
        { text: "The best way to predict the future is to create it.", author: "Peter Drucker"},
        { text: "Strength is built in the silence of your actions, not the noise of your words.", author: "Unknown Strongman Proverb"},
        { text: "When you think you can't, re-evaluate. You usually can. You just don't want to badly enough.", author: "Ed Coan (Powerlifter)"},
        { text: "The Iron never lies to you. You can walk outside and listen to all kinds of talk, get told that you're a god or a total bastard. The Iron will always kick you the real deal. The Iron is the great reference point, the all-knowing perspective giver. Always there like a beacon in the pitch black. I have found the Iron to be my greatest friend. It never freaks out on me, never runs. Friends may come and go. But two hundred pounds is always two hundred pounds.", author: "Henry Rollins" },
        { text: "Pain is temporary. It may last a minute, or an hour, or a day, or a year, but eventually it will subside and something else will take its place. If I quit, however, it lasts forever.", author: "Lance Armstrong" }, // Controversial but quote is known
        { text: "There's more to fighting than raw strength. There's cleverness, technique. That you learn by fighting smarter, not just harder.", author: "Eddie Hall (Strongman, on strategy)"},
        { text: "Squat till you walk funny.", author: "Powerlifting Saying"},
        { text: "No matter how strong you get, there is always someone stronger. So keep training, keep learning, and stay humble.", author: "Martins Licis (Strongman)"}
    ];

    function displayRandomQuote() {
        if (motivationalQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
            const quote = motivationalQuotes[randomIndex];
            quoteTextElement.textContent = `"${quote.text}"`;
            quoteAuthorElement.textContent = `- ${quote.author}`;
        } else {
            quoteTextElement.textContent = "Remember to stay consistent and push your limits!";
            quoteAuthorElement.textContent = "- Your Fitness App";
        }
    }

    // Display a quote on initial load
    displayRandomQuote();

    // Initial workout generation is now handled by user click.
}); 