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

    // --- Warm-up Data ---
    const warmupExercises = {
        general: [ // General full body warm-up, can be used as a default
            { name: "Light Cardio (Jogging in place, Jumping Jacks)", details: "3-5 minutes" },
            { name: "Arm Circles", details: "10-15 forward & backward" },
            { name: "Leg Swings (Forward & Sideways)", details: "10-12 each leg, each direction" },
            { name: "Torso Twists", details: "10-15 each side" },
            { name: "Dynamic Stretches (e.g., Walking Lunges, High Knees)", details: "5-10 reps per exercise" }
        ],
        chest: [
            { name: "Arm Swings Across Chest", details: "10-15 reps" },
            { name: "Shoulder Rotations (External/Internal with band or light weight)", details: "10-15 reps each" },
            { name: "Push-up Scapular Retractions", details: "10-15 reps" }
        ],
        back: [
            { name: "Cat-Cow Stretches", details: "10-15 cycles" },
            { name: "Band Pull-Aparts", details: "15-20 reps" },
            { name: "Bird-Dog", details: "10-12 reps each side" }
        ],
        legs: [
            { name: "Bodyweight Squats", details: "15-20 reps" },
            { name: "Walking Lunges", details: "10-12 reps each leg" },
            { name: "Ankle Rotations", details: "10-15 each direction, each ankle" },
            { name: "Hip Circles", details: "10-15 each direction" }
        ],
        shoulders: [
            { name: "Shoulder Dislocates (with band or PVC pipe)", details: "10-15 reps" },
            { name: "Wall Slides", details: "10-15 reps" },
            { name: "Lateral Arm Raises (no weight or very light)", details: "15-20 reps" }
        ],
        arms: [ // Biceps & Triceps
            { name: "Light Bicep Curls (band or very light dumbbells)", details: "15-20 reps" },
            { name: "Light Triceps Pushdowns/Extensions (band or very light)", details: "15-20 reps" },
            { name: "Wrist Rotations", details: "10-15 each direction" }
        ],
        fullbody: [ // Can reuse general or make specific
            { name: "Light Cardio (Rowing, Assault Bike, Jogging)", details: "5-7 minutes" },
            { name: "Dynamic Movement Circuit (e.g., Inchworms, Spider-Man Lunges, Bear Crawls)", details: "1-2 rounds" },
            { name: "Activation for main lifts (e.g., Goblet Squats, Banded Glute Bridges)", details: "As needed" }
        ]
        // Strongman and Powerlifting might have more specific warmups focusing on movement prep
        // For now, they can use the day-specific ones or general.
    };

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
                    videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg",
                    description: "The barbell bench press is a fundamental compound exercise for developing the pectoralis major (chest), as well as the anterior deltoids (front shoulders) and triceps. Its ability to handle heavy loads makes it excellent for building upper body mass and strength.",
                    alternatives: [
                        { name: "Dumbbell Bench Press", sets: "4", reps: "8-12", videoUrl: "https://www.youtube.com/embed/VmB1G1K7v94", description: "Dumbbell bench press allows for a greater range of motion and can help address muscle imbalances." },
                        { name: "Push-ups", sets: "4", reps: "AMRAP", videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4", description: "Push-ups are a great bodyweight alternative that still effectively work the chest, shoulders, and triceps." }
                    ]
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
                    videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g",
                    description: "Pull-ups are a highly effective compound exercise for the latissimus dorsi (lats), biceps, and overall upper back. Lat pulldowns are a good alternative if pull-ups are too challenging, providing similar muscle activation.",
                    alternatives: [
                        { name: "Lat Pulldowns", sets: "4", reps: "10-15", videoUrl: "https://www.youtube.com/embed/gripNHtX8kI", description: "Lat pulldowns target similar muscles to pull-ups but allow for easier weight adjustment." },
                        { name: "Inverted Rows", sets: "4", reps: "10-15", videoUrl: "https://www.youtube.com/embed/KOaSDBI4SUE", description: "Inverted rows are a bodyweight exercise that are a good precursor or alternative to pull-ups." }
                    ]
                },
                {
                    name: "Barbell Rows",
                    sets: "4",
                    reps: "8-12",
                    videoUrl: "https://www.youtube.com/embed/kBWAon7ItDw", // Reverted: Built With Science - How To PROPERLY Barbell Row
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
                    videoUrl: "https://www.youtube.com/embed/Uv_DKDl7EjA",
                    description: "Barbell squats are a king of leg exercises, developing the quadriceps, hamstrings, glutes, and even engaging the core and lower back for stabilization. They are highly effective for overall leg strength and hypertrophy.",
                    alternatives: [
                        { name: "Goblet Squats", sets: "3", reps: "10-15", videoUrl: "https://www.youtube.com/embed/MeW_x-M9fH4", description: "Goblet squats are a more accessible squat variation, excellent for learning form and still challenging the legs and core." },
                        { name: "Leg Press", sets: "4", reps: "12-15", videoUrl: "https://www.youtube.com/embed/sEMarc3VqD0", description: "Leg press allows for heavy leg training with less lower back strain." }
                    ]
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
            arms: [ // Biceps & Triceps
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
                    videoUrl: "https://www.youtube.com/embed/TwD-YGa3u4c", // ScottHermanFitness - Hammer Curls
                    description: "Hammer curls, with a neutral grip, target the brachialis and brachioradialis in addition to the biceps. They are great for adding thickness to the arms."
                },
                {
                    name: "Overhead Dumbbell Extension",
                    sets: "3",
                    reps: "10-15",
                    videoUrl: "https://www.youtube.com/embed/YbX7Wd8jQ-Q", // Built with Science - Overhead Tricep Extension
                    description: "Overhead dumbbell extensions emphasize the long head of the triceps, which is important for overall triceps size. Focus on a full stretch at the bottom and a strong contraction at the top."
                },
                {
                    name: "Concentration Curls",
                    sets: "3",
                    reps: "12-15",
                    videoUrl: "https://www.youtube.com/embed/0AUGkch3tzc", // Jeff Nippard - Concentration Curl
                    description: "Concentration curls are an isolation exercise for the biceps that allows for a strong peak contraction. Performed seated with the arm braced against the inner thigh."
                },
                {
                    name: "Triceps Pushdowns (Rope or Bar)",
                    sets: "3",
                    reps: "12-15",
                    videoUrl: "https://www.youtube.com/embed/2-LAMcpzODU", // Athlean-X - Rope Pushdown
                    description: "Triceps pushdowns are a versatile isolation exercise for the triceps. The rope attachment allows for a greater range of motion and emphasis on the lateral head, while a straight bar can also be effective."
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
            chest: [ 
                { 
                    name: "Barbell Bench Press", 
                    sets: "5", 
                    reps: "5 (heavy)", 
                    videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg", 
                    description: "The primary powerlifting movement for chest. Focus is on moving maximum weight for lower reps, building raw strength in chest, shoulders, and triceps.",
                    worldRecord: "Raw WR: 355 kg (782.6 lbs) - Julius Maddox"
                },
                { name: "Close-Grip Bench Press", sets: "3", reps: "6-8", videoUrl: "https://www.youtube.com/embed/nEF0bv2FW94", description: "A bench press variation that places more emphasis on the triceps and inner chest. Builds triceps strength crucial for locking out heavy benches." },
                { name: "Paused Bench Press", sets: "3", reps: "3-5", videoUrl: "https://www.youtube.com/embed/1mPM9scyItU", description: "Involves pausing the bar on the chest, which eliminates momentum and builds strength from a dead stop. Improves control and power at the bottom of the lift." },
                { name: "Triceps Pushdowns", sets: "3", reps: "8-12", videoUrl: "https://www.youtube.com/embed/2-LAMcpzODU", description: "Accessory exercise to build triceps volume and strength, supporting a stronger bench press lockout." }
            ],
            back: [ 
                { 
                    name: "Deadlifts (Conventional or Sumo)", 
                    sets: "1-3", 
                    reps: "1-5 (heavy, work up to top set)", 
                    videoUrl: "https://www.youtube.com/embed/op9kVnSso6Q", 
                    description: "A core powerlifting lift, testing overall strength. Engages nearly every muscle, primarily posterior chain (hamstrings, glutes, entire back). Sumo and Conventional are two main stances.",
                    worldRecord: "Raw Conventional WR: 487.5 kg (1,074.5 lbs) - Danny Grigsby"
                },
                { name: "Barbell Rows", sets: "4", reps: "6-10", videoUrl: "https://www.youtube.com/embed/I0uhDZ06hrQ", description: "Builds back thickness and strength supportive of deadlifts and overall stability. Heavier weight and slightly lower reps than bodybuilding style." },
                { name: "Good Mornings", sets: "3", reps: "8-12", videoUrl: "https://www.youtube.com/embed/vKPGe8zb2S4", description: "Strengthens the lower back, hamstrings, and glutes. Excellent for building posterior chain strength that carries over to squats and deadlifts." },
                { name: "Lat Pulldowns", sets: "3", reps: "8-12", videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g", description: "Accessory exercise for lat development, contributing to a stronger and more stable upper back for all lifts." }
            ],
            legs: [ 
                { 
                    name: "Barbell Squats (High Bar or Low Bar)", 
                    sets: "5", 
                    reps: "5 (heavy)", 
                    videoUrl: "https://www.youtube.com/embed/Uv_DKDl7EjA", 
                    description: "The primary powerlifting movement for legs. Focus on maximal weight for lower reps. High bar and low bar positions alter mechanics and muscle emphasis slightly.",
                    worldRecord: "Raw WR: 490 kg (1,080.2 lbs) - Ray Williams"
                },
                { name: "Front Squats", sets: "3", reps: "5-8", videoUrl: "https://www.youtube.com/embed/Y2wAl3ekS4E", description: "A squat variation that emphasizes quadriceps and upper back strength. Requires core stability and helps improve posture under load." },
                { name: "Pause Squats", sets: "3", reps: "3-5", videoUrl: "https://www.youtube.com/embed/vm0XIc2xHSc", description: "Involves pausing at the bottom of the squat, building strength out of the hole and improving control and stability. Excellent for overcoming sticking points." },
                { name: "Hamstring Curls", sets: "3", reps: "8-12", videoUrl: "https://www.youtube.com/embed/1Tq3QdYUHBg", description: "Accessory exercise for hamstring development, contributing to knee stability and pulling strength in deadlifts." }
            ],
             shoulders: [ 
                { name: "Overhead Press", sets: "4", reps: "5-8", videoUrl: "https://www.youtube.com/embed/2yjwXTZQDDI", description: "Builds shoulder and triceps strength, which is supportive of the bench press. Performed with a focus on strength in the 5-8 rep range." },
                { name: "Face Pulls", sets: "3", reps: "10-15", videoUrl: "https://www.youtube.com/embed/rep-qVOkqgk", description: "Important for shoulder health, balancing out pressing movements by strengthening rear delts and external rotators." },
                { name: "Lateral Raises", sets: "3", reps: "10-15", videoUrl: "https://www.youtube.com/embed/3VcKaXpzqRo", description: "Accessory for medial deltoid development, contributing to shoulder stability and overall aesthetics." }
            ],
            arms: [ 
                { name: "Barbell Curls", sets: "3", reps: "8-10", videoUrl: "https://www.youtube.com/embed/kwG2ipFRgfo", description: "General bicep work, can help with elbow health and stability during heavy pressing and pulling." },
                { name: "Skullcrushers", sets: "3", reps: "8-10", videoUrl: "https://www.youtube.com/embed/Nggo1MCEiV0", description: "Triceps isolation exercise to build strength and mass, supporting lockout in bench press and OHP." }
            ],
            fullbody: [ 
                { name: "Day 1: Squat Focus", details: "Squat (e.g., 5x5), Bench Press (e.g., 5x5), Barbell Row (e.g., 5x5). Video links and descriptions would be for each specific lift.", videoUrl: "https://www.youtube.com/embed/Uv_DKDl7EjA", description: "Focus on mastering compound lifts. Squats for lower body and core, Bench for upper body push, Rows for upper body pull.", worldRecord: "Raw WR: 490 kg (1,080.2 lbs) - Ray Williams"},
                { name: "Day 2: Rest or Light Activity", details: "Active recovery like walking or stretching is beneficial." , description: "Rest is crucial for muscle recovery and growth in powerlifting."},
                { name: "Day 3: Deadlift Focus", details: "Deadlift (e.g., 1x5), Overhead Press (e.g., 5x5), Pull-ups (e.g., 3xAMRAP).", videoUrl: "https://www.youtube.com/embed/op9kVnSso6Q", description: "Deadlifts build overall strength. Overhead Press for vertical pushing. Pull-ups for vertical pulling.", worldRecord: "Raw Conventional WR: 487.5 kg (1,074.5 lbs) - Danny Grigsby"},
                { name: "Day 4: Rest or Light Activity", details: "Focus on mobility or light cardio.", description: "Continued recovery and preparation for the next heavy session."},
                { name: "Day 5: Bench Focus", details: "Bench Press (e.g., 5x5, can be a variation or different intensity), Squat (e.g., 3x5, often lighter), Accessory exercises.", videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg", description: "Another opportunity to drive bench press progress, with squats at a lighter intensity to maintain technique and volume.", worldRecord: "Raw WR: 355 kg (782.6 lbs) - Julius Maddox"}
            ]
        },
        strongman: { 
            chest: [ 
                { 
                    name: "Log Press (or Axle Press)", 
                    sets: "5", 
                    reps: "3-5 (working up)", 
                    videoUrl: "https://www.youtube.com/embed/uXGjH7qA0cM", 
                    description: "A staple strongman overhead pressing event. The log's neutral grip and awkwardness build unique pressing strength, targeting shoulders, triceps, and chest.",
                    worldRecord: "Log Press WR: 228 kg (502.6 lbs) - Žydrūnas Savickas"
                },
                { name: "Incline Bench Press", sets: "3", reps: "6-8", videoUrl: "https://www.youtube.com/embed/8iPEnn-ltC8", description: "Builds upper chest and shoulder strength, useful as an accessory for overhead pressing events in strongman." },
                { name: "Weighted Dips", sets: "3", reps: "AMRAP", videoUrl: "https://www.youtube.com/embed/6MxlhWqP4jo", description: "Develops pressing power in the chest, shoulders, and triceps. AMRAP (As Many Reps As Possible) builds muscular endurance and strength." }
            ],
            back: [ 
                { 
                    name: "Axle Deadlifts (or Conventional/Sumo)", 
                    sets: "Varies", 
                    reps: "Work up to a heavy single/triple", 
                    videoUrl: "https://www.youtube.com/embed/zGrGkSAHjKk", 
                    description: "Deadlifts with an axle bar (thicker, no knurling) heavily challenge grip strength in addition to the posterior chain. Conventional/Sumo are stance options.",
                    worldRecord: "Strongman Deadlift WR (Elephant Bar): 501 kg (1,104.5 lbs) - Hafþór Júlíus Björnsson"
                },
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
            shoulders: [ 
                { 
                    name: "Overhead Press (Axle, Log, Dumbbell)", 
                    sets: "5", 
                    reps: "3-5 (working up)", 
                    videoUrl: "https://www.youtube.com/embed/0RMp242mI1A", 
                    description: "Overhead pressing is a key component of strongman. Axle and Log presses are common event variations, building raw shoulder and triceps power."
                    // Note: Log Press WR is separate (added to Log Press specifically). Could add Axle Press WR (e.g. Žydrūnas Savickas 210kg) if a pure Axle Press entry is made.
                },
                { name: "Viking Press", sets: "3", reps: "8-12", videoUrl: "https://www.youtube.com/embed/7gSYT9J2_Yg", description: "A machine-based or lever-based overhead press that allows for high repetitions, building shoulder hypertrophy and endurance specific to pressing." },
                { name: "Lateral Raises (Heavy)", sets: "3", reps: "10-15", videoUrl: "https://www.youtube.com/embed/3VcKaXpzqRo", description: "While strongman focuses on compounds, heavy lateral raises can build medial deltoid strength and size, contributing to pressing stability." },
                { name: "Face Pulls", sets: "3", reps: "15-20", videoUrl: "https://www.youtube.com/embed/rep-qVOkqgk", description: "Crucial for shoulder health to balance heavy pressing, strengthening rear delts and external rotators." }
            ],
            arms: [ 
                { name: "Strict Curls (Thick Bar if possible)", sets: "3", reps: "6-10", videoUrl: "https://www.youtube.com/embed/kwG2ipFRgfo", description: "Builds bicep strength. Using a thick bar (axle) will also heavily recruit forearm and grip strength, beneficial for many strongman events." },
                { name: "Close Grip Log Press", sets: "3", reps: "6-10", videoUrl: "https://www.youtube.com/embed/uXGjH7qA0cM", description: "Performing log presses with a closer grip can shift more emphasis to the triceps, building pressing power specific to the implement." } 
            ],
            fullbody: [ 
                { name: "Event Medley 1", details: "Example: Yoke Walk -> Farmers Carry -> Sandbag Load over bar. Focus on transitions and speed.", videoUrl: "https://www.youtube.com/embed/tDS1P7yzafI", description: "Medleys combine multiple strongman events in sequence, testing overall conditioning, strength-endurance, and mental fortitude." },
                { name: "Event Medley 2", details: "Example: Tire Flip -> Sled Drag -> Stone Over Bar. Vary events to cover different strengths.", videoUrl: "https://www.youtube.com/embed/xTireS5ak2Q", description: "Another example of an event medley, crucial for simulating competition conditions and building work capacity." },
                { name: "Heavy Compound Lift", details: "e.g., Max Deadlift or Squat variation, or a heavy Log Press attempt. Focus on a single heavy lift.", videoUrl: "https://www.youtube.com/embed/op9kVnSso6Q", description: "Dedicated days or parts of sessions for pushing maximal strength on key compound lifts that are either events themselves or highly transferable." }
            ]
        },
        // --- ATHLETE TEMPLATES START ---
        CBumBodybuilding: {
            'Chest, Triceps, Rear Delts': [
                { name: "Incline Dumbbell Press", sets: "4", reps: "6-8", videoUrl: "https://www.youtube.com/embed/8iPEnn-ltC8", description: "CBum often starts chest with incline movements. Focus on slow eccentrics and a powerful press." },
                { name: "Machine Chest Press (GVT style)", sets: "10", reps: "10", videoUrl: "https://www.youtube.com/embed/sPZcDBxS01A", description: "German Volume Training (10x10) for hypertrophy. Use a weight you can manage for all sets." },
                { name: "Barbell JM Press", sets: "2", reps: "8-10", videoUrl: "https://www.youtube.com/embed/dZgV00jAIzI", description: "A hybrid press targeting triceps and chest." },
                { name: "Machine Dips", sets: "2", reps: "10-12", videoUrl: "https://www.youtube.com/embed/JcZ23bF7T7E", description: "Targets chest and triceps, good for controlled movements." },
                { name: "Standing Overhead Cable Triceps Extension", sets: "2", reps: "12-15", videoUrl: "https://www.youtube.com/embed/X-iH7HOLj34", description: "Hits the long head of the triceps." },
                { name: "Standing Single Arm Forward Cable Extension", sets: "3", reps: "12-15", videoUrl: "https://www.youtube.com/embed/CFr_qV-e6ew", description: "Single arm tricep isolation." },
                { name: "Cable Facepull", sets: "3", reps: "12-15", videoUrl: "https://www.youtube.com/embed/rep-qVOkqgk", description: "For rear delts and shoulder health." }
            ],
            'Back and Biceps': [
                { name: "Underhand Grip Barbell Row", sets: "4", reps: "6-8", videoUrl: "https://www.youtube.com/embed/B-cX02DjDEg", description: "Targets lats and biceps with a supinated grip." },
                { name: "Chest Supported Dumbbell Row (GVT style)", sets: "10", reps: "10", videoUrl: "https://www.youtube.com/embed/H75im9fAUMc", description: "German Volume Training for back thickness, minimizes cheating." },
                { name: "EZ Bar Preacher Curl", sets: "4", reps: "8-10", videoUrl: "https://www.youtube.com/embed/Gydpcouclx8", description: "Isolates the biceps." },
                { name: "Standing Reverse Grip EZ Bar Curl", sets: "4", reps: "10-12", videoUrl: "https://www.youtube.com/embed/_ZHQMD_CdcQ", description: "Targets brachialis and forearms." },
                { name: "Low Pulley Cable Curl", sets: "4", reps: "12-15", videoUrl: "https://www.youtube.com/embed/HMIUVGVILGw", description: "Constant tension for biceps." },
                { name: "Machine Pullover", sets: "3", reps: "10-12", videoUrl: "https://www.youtube.com/embed/asQ5e9Bd1Gc", description: "Targets lats and serratus." },
                { name: "Fat Gripz Machine Preacher Curl", sets: "3", reps: "12-15", videoUrl: "https://www.youtube.com/embed/F33L5PuiCH8", description: "Increases grip and forearm activation." }
            ],
            'Quads and Calves': [
                { name: "Belt Squat", sets: "3-4", reps: "10-12", videoUrl: "https://www.youtube.com/embed/W__NpLkO2CI", description: "Quad focus without heavy spinal loading." },
                { name: "Pendulum Squat", sets: "3", reps: "10-12", videoUrl: "https://www.youtube.com/embed/J8czl8DDnJ4", description: "Machine squat for quad development." },
                { name: "Hack Squat", sets: "3", reps: "10-12", videoUrl: "https://www.youtube.com/embed/0tn5K9NlCfo", description: "Another excellent quad builder." },
                { name: "Leg Press", sets: "3", reps: "8-10", videoUrl: "https://www.youtube.com/embed/sEMarc3VqD0", description: "Overall leg development." },
                { name: "Leg Extension", sets: "3", reps: "10-12", videoUrl: "https://www.youtube.com/embed/YyvSfVjQeL0", description: "Quad isolation." },
                { name: "Seated Hip Adduction Machine", sets: "3", reps: "12-15", videoUrl: "https://www.youtube.com/embed/CjAVezAggkI", description: "Targets inner thighs." },
                { name: "Seated Calf Raise", sets: "3", reps: "12-15", videoUrl: "https://www.youtube.com/embed/JbyjNymZOt0", description: "Soleus muscle focus." }
            ],
            'Shoulders': [
                { name: "Machine or Cable Side Raise", sets: "4", reps: "10-15", videoUrl: "https://www.youtube.com/embed/3VcKaXpzqRo", description: "CBum emphasizes controlled side raises for shoulder width." },
                { name: "Machine Shoulder Press", sets: "4", reps: "8-10", videoUrl: "https://www.youtube.com/embed/Y_7gYDm_rms", description: "Machine press for shoulder development." },
                { name: "Reverse Pec Deck", sets: "4", reps: "10-12", videoUrl: "https://www.youtube.com/embed/H5gZgG2gX6Y", description: "Targets rear deltoids." },
                { name: "Seated Dumbbell Side Raise", sets: "4", reps: "10-12", videoUrl: "https://www.youtube.com/embed/3VcKaXpzqRo", description: "Another variation for medial delts." },
                { name: "Seated Dumbbell Shoulder Press", sets: "3", reps: "10-12", videoUrl: "https://www.youtube.com/embed/B-aVuyAUY3k", description: "Classic shoulder mass builder." }
            ],
            'Arms': [
                 { name: "Rope Overhead Cable Extension", sets: "4", reps: "10-12", videoUrl: "https://www.youtube.com/embed/X-iH7HOLj34", description: "Triceps long head focus." },
                 { name: "Decline Cable Skull Crusher", sets: "4", reps: "10-12", videoUrl: "https://www.youtube.com/embed/kQi8819c7js", description: "Skullcrusher variation." },
                 { name: "Rope Cable Pressdown", sets: "4", reps: "10-12", videoUrl: "https://www.youtube.com/embed/2-LAMcpzODU", description: "Standard tricep pushdown." },
                 { name: "EZ Bar Reverse Grip Preacher Curl", sets: "4", reps: "8-10", videoUrl: "https://www.youtube.com/embed/jZ-D0505vBQ", description: "Targets brachialis." },
                 { name: "Wide Incline Dumbbell Curl", sets: "4", reps: "10-12", videoUrl: "https://www.youtube.com/embed/soxrZ14LMMY", description: "Bicep stretch and peak." },
                 { name: "Machine Preacher Curl", sets: "4", reps: "10-12", videoUrl: "https://www.youtube.com/embed/03j8UvwzTKM", description: "Machine isolation for biceps." },
                 { name: "Standing Dumbbell Hammer Curls", sets: "3", reps: "10-12", videoUrl: "https://www.youtube.com/embed/TwD-YGa3u4c", description: "Builds bicep and forearm thickness." }
            ],
             'Chest and Back': [
                { name: "Incline Dumbbell Press (Superset w/ Underhand Lat Pulldown)", sets: "4", reps: "10-12", videoUrl: "https://www.youtube.com/embed/8iPEnn-ltC8", description: "Agonist-antagonist superset." },
                { name: "Underhand Lat Pulldown (Superset w/ Incline DB Press)", sets: "4", reps: "10-12", videoUrl: "https://www.youtube.com/embed/gripNHtX8kI", description: "Targets lats." },
                { name: "Chest Supported T-Bar Row (Superset w/ Incline Machine Press)", sets: "4", reps: "10-12", videoUrl: "https://www.youtube.com/embed/K_x_wALSX5c", description: "Back thickness." },
                { name: "Incline Machine Press (Superset w/ T-Bar Row)", sets: "4", reps: "10-12", videoUrl: "https://www.youtube.com/embed/1zUm0nI2jB8", description: "Upper chest focus." },
                { name: "Incline Machine Fly (Superset w/ Pullover Machine)", sets: "4", reps: "10-12", videoUrl: "https://www.youtube.com/embed/x4J2a0k6A6Y", description: "Chest isolation." },
                { name: "Pullover Machine (Superset w/ Incline Machine Fly)", sets: "4", reps: "10-12", videoUrl: "https://www.youtube.com/embed/M2kaGkbs4vM", description: "Lats and serratus." }
            ],
            'Hamstrings, Glutes, Calves': [
                { name: "Seated Hip Abduction", sets: "3", reps: "10-12", videoUrl: "https://www.youtube.com/embed/dDF4d96Tuxs", description: "Outer glutes/hips." },
                { name: "Seated Leg Curl", sets: "3", reps: "10-12", videoUrl: "https://www.youtube.com/embed/g1uP2C8kP6c", description: "Hamstring isolation." },
                { name: "Seated Hip Adduction Machine", sets: "3", reps: "10-12", videoUrl: "https://www.youtube.com/embed/mAds9c3cW74", description: "Inner thighs." },
                { name: "Plate Loaded Hip Thrust Machine", sets: "3", reps: "10-12", videoUrl: "https://www.youtube.com/embed/Gux__pTwN6E", description: "Glute development." },
                { name: "Barbell Stiff Leg Deadlift", sets: "3", reps: "6-8", videoUrl: "https://www.youtube.com/embed/1Y9e0sAvb2s", description: "Hamstrings and glutes." },
                { name: "Lying Leg Curl", sets: "3", reps: "10-12", videoUrl: "https://www.youtube.com/embed/1Tq3QdYUHBg", description: "Another hamstring isolation exercise." },
                { name: "Standing Calf Raises", sets: "3", reps: "10-12", videoUrl: "https://www.youtube.com/embed/JbyjNymZOt0", description: "Gastrocnemius focus." }
            ]
        },
        MitchellHooperStrongman: {
            'Day 1: Squat & Push (Heavy)': [
                { name: "Barbell Back Squat", sets: "Work to a Top Set (e.g. 1-3 Rep Max), then 2-3 backoff sets", reps: "3-5", videoUrl: "https://www.youtube.com/embed/Uv_DKDl7EjA", description: "Primary lower body strength builder. Focus on heavy loads with good form." },
                { name: "Log Press", sets: "Work to a Top Set (e.g. 1-3 Rep Max), then 2-3 backoff sets", reps: "1-5", videoUrl: "https://www.youtube.com/embed/6wOySp4aT2U", description: "Core Strongman overhead movement. Focus on explosive power from legs and strong lockout." },
                { name: "Close Grip Bench Press", sets: "3-4", reps: "6-10", videoUrl: "https://www.youtube.com/embed/cXbWDe2r2hA", description: "Builds tricep and pressing strength, accessory for Log Press." },
                { name: "Good Mornings", sets: "3", reps: "8-12", videoUrl: "https://www.youtube.com/embed/vKPGe8zb2S4", description: "Strengthens posterior chain, crucial for squats and overall stability." }
            ],
            'Day 2: Overhead & Leg Accessory (Volume/Speed)': [
                { name: "Axle Bar Overhead Press (for reps or speed)", sets: "4-5", reps: "6-10 or AMRAP in time", videoUrl: "https://www.youtube.com/embed/eoIO9TocoUw", description: "Develops overhead pressing endurance and power with a challenging grip." },
                { name: "Front Squats", sets: "3-4", reps: "5-8", videoUrl: "https://www.youtube.com/embed/m4ytaCJZpl0", description: "Quad focused squat variation, also builds core strength and upper back stability for carries." },
                { name: "Walking Lunges (Dumbbell or Barbell)", sets: "3", reps: "10-15 per leg", videoUrl: "https://www.youtube.com/embed/L8fvypoCDyQ", description: "Unilateral leg strength, balance, and conditioning." },
                { name: "Kettlebell Swings", sets: "3-4", reps: "15-25", videoUrl: "https://www.youtube.com/embed/YSxHifyI6s8", description: "Develops explosive hip power, hamstring and glute strength, and conditioning." }
            ],
            'Day 3: Hinge & Pull (Heavy)': [
                { name: "Deadlift (Competition Stance - e.g., Conventional or Axle)", sets: "Work to a Top Set (e.g. 1-3 Rep Max), then 2-3 backoff sets", reps: "1-5", videoUrl: "https://www.youtube.com/embed/VL5Ab0T07e4", description: "Primary hinging movement. Focus on heavy loads, maintaining form." },
                { name: "Farmer's Walk", sets: "3-4 sets", reps: "Max distance or time (e.g., 50-100ft)", videoUrl: "https://www.youtube.com/embed/lkHlJ81W0kM", description: "Builds tremendous grip, core strength, and conditioning. Crucial strongman event." },
                { name: "Bent Over Rows (Barbell or Dumbbell)", sets: "3-4", reps: "8-12", videoUrl: "https://www.youtube.com/embed/kBWAon7ItDw", description: "Develops back thickness and pulling strength, supporting deadlifts and carries." },
                { name: "Hamstring Curls (Lying or Seated)", sets: "3", reps: "10-15", videoUrl: "https://www.youtube.com/embed/1Tq3QdYUHBg", description: "Isolates hamstrings, important for knee flexion and deadlift power." }
            ],
             'Day 4: Event Practice / Conditioning (Optional)': [ // This day is highly variable
                { name: "Atlas Stone Lifts (or Sandbag Lifts)", sets: "Varies", reps: "Varies", videoUrl: "https://www.youtube.com/embed/Sc4hZ4pfk_A", description: "Practice technique and build strength for specific strongman events." },
                { name: "Yoke Walk", sets: "Varies", reps: "Varies", videoUrl: "https://www.youtube.com/embed/zDrRi4AbZg4", description: "Practice for yoke event, builds core and leg drive under heavy load." },
                { name: "Sled Drags/Pushes", sets: "Varies", reps: "Varies", videoUrl: "https://www.youtube.com/embed/DAPgP7I2N4g", description: "Excellent for conditioning and building leg drive." }
            ]
        },
        JesusOlivaresPowerlifting: { // Based on typical powerlifting programming focusing on S/B/D
            'Day 1: Squat Focus (Heavy)': [
                { name: "Competition Squat", sets: "Work up to 1 Top Single @ RPE 8-9, then 3-4 sets", reps: "3-5 @ RPE 7-8 (Backoff)", videoUrl: "https://www.youtube.com/embed/Uv_DKDl7EjA", description: "Main squat movement. Top set for strength, backoff sets for volume and technique. Jesus Olivares is known for his massive squat (WR 478kg)." },
                { name: "Pause Squats", sets: "3", reps: "3-5", videoUrl: "https://www.youtube.com/embed/8GADuL93BvA", description: "Builds strength out of the hole and reinforces technique. Hold for 2-3 seconds at the bottom." },
                { name: "Good Mornings", sets: "3", reps: "8-12", videoUrl: "https://www.youtube.com/embed/vKPGe8zb2S4", description: "Strengthens posterior chain (lower back, glutes, hamstrings). Essential for squat and deadlift support." },
                { name: "Leg Extensions", sets: "3", reps: "12-15", videoUrl: "https://www.youtube.com/embed/YyvSfVjQeL0", description: "Quadricep isolation for hypertrophy and knee health."}
            ],
            'Day 2: Bench Focus (Heavy)': [
                { name: "Competition Bench Press", sets: "Work up to 1 Top Single @ RPE 8-9, then 3-4 sets", reps: "3-5 @ RPE 7-8 (Backoff)", videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg", description: "Main bench movement. Jesus Olivares has a 272.5kg competition bench." },
                { name: "Close Grip Bench Press", sets: "3", reps: "5-8", videoUrl: "https://www.youtube.com/embed/cXbWDe2r2hA", description: "Strengthens triceps for bench lockout and builds overall pressing strength." },
                { name: "Dumbbell Shoulder Press", sets: "3", reps: "8-12", videoUrl: "https://www.youtube.com/embed/B-aVuyAUY3k", description: "Builds shoulder strength, important for bench stability and power." },
                { name: "Barbell Rows (e.g., Pendlay)", sets: "4", reps: "6-10", videoUrl: "https://www.youtube.com/embed/ZlX_M9iV9xY", description: "Builds upper back strength to create a solid platform for benching." }
            ],
            'Day 3: Deadlift Focus (Heavy)': [
                { name: "Competition Deadlift (Conventional)", sets: "Work up to 1 Top Single @ RPE 8-9, then 2-3 sets", reps: "3-5 @ RPE 7-8 (Backoff)", videoUrl: "https://www.youtube.com/embed/VL5Ab0T07e4", description: "Main deadlift movement. Jesus Olivares has a WR deadlift of 410kg." },
                { name: "Romanian Deadlifts (RDLs)", sets: "3", reps: "6-10", videoUrl: "https://www.youtube.com/embed/JCXUYuzwNrM", description: "Develops hamstring and glute strength crucial for deadlift performance." },
                { name: "Lat Pulldowns (Heavy)", sets: "4", reps: "8-12", videoUrl: "https://www.youtube.com/embed/gripNHtX8kI", description: "Strong lats help keep the bar close during deadlifts and maintain upper back tightness." },
                { name: "Hyperextensions (with weight)", sets: "3", reps: "10-15", videoUrl: "https://www.youtube.com/embed/p8NAl5y9iHo", description: "Strengthens lower back and glutes." }
            ],
            'Day 4: Accessory / Volume Day (Lighter)': [
                { name: "Squat (Volume/Technique)", sets: "4-5", reps: "5-8 @ RPE 6-7", videoUrl: "https://www.youtube.com/embed/Uv_DKDl7EjA", description: "Lighter squats focusing on bar speed, technique, and building volume." },
                { name: "Bench Press (Volume/Technique, or variation like Incline/Spoto)", sets: "4-5", reps: "6-10 @ RPE 6-7", videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg", description: "Lighter bench work or a variation to address weak points and build volume." },
                { name: "Accessory Pulling (e.g., Dumbbell Rows, Face Pulls)", sets: "3-4 each", reps: "10-15", videoUrl: "https://www.youtube.com/embed/5PoEksoZN58", description: "Upper back volume for posture and strength." },
                { name: "Core Work (e.g., Planks, Ab Wheel)", sets: "3-4", reps: "To failure or timed", videoUrl: "https://www.youtube.com/embed/G_0j0Za8WvA", description: "Direct core work for stability in all lifts." }
            ]
        }
        // --- ATHLETE TEMPLATES END ---
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

        // Swap buttons (New)
        document.querySelectorAll('.swap-exercise-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const exerciseIndex = parseInt(e.target.getAttribute('data-index'));
                const originalExercise = currentGeneratedWorkout.exercises[exerciseIndex];
                
                if (originalExercise.alternatives && originalExercise.alternatives.length > 0) {
                    // Determine the next alternative
                    // We'll store the current alternative index on the exercise object itself, or default to 0
                    let currentAltIndex = originalExercise.currentAlternativeIndex || 0;
                    
                    const nextAlternative = originalExercise.alternatives[currentAltIndex];
                    
                    // Prepare the swapped exercise object
                    // Keep original notes if any, or reset them
                    const swappedExercise = {
                        ...nextAlternative, // Base properties from the alternative
                        name: nextAlternative.name, // Ensure name is from alternative
                        sets: nextAlternative.sets || originalExercise.sets, // Use alternative's or original's
                        reps: nextAlternative.reps || originalExercise.reps,
                        videoUrl: nextAlternative.videoUrl || originalExercise.videoUrl,
                        description: nextAlternative.description || originalExercise.description,
                        alternatives: originalExercise.alternatives, // Keep the list of alternatives
                        originalName: originalExercise.originalName || originalExercise.name, // Store original name if not already an alt
                        currentAlternativeIndex: (currentAltIndex + 1) % originalExercise.alternatives.length, // Cycle to next
                        notes: originalExercise.notes // Preserve notes
                    };
                    
                    // If we've cycled through all alternatives, offer to go back to original
                    if (swappedExercise.currentAlternativeIndex === 0 && originalExercise.originalName) {
                         // Special case: next alternative is to revert to original
                         const originalForSwap = workouts[trainingTypeSelect.value]?.[daySelect.value]?.find(ex => ex.name === originalExercise.originalName);
                         if (originalForSwap) {
                            currentGeneratedWorkout.exercises[exerciseIndex] = {
                                ...originalForSwap,
                                notes: originalExercise.notes, // Preserve notes
                                alternatives: originalExercise.alternatives // Re-attach alternatives list
                                // currentAlternativeIndex will be reset/undefined here
                            };
                         } else {
                            // Fallback if original somehow not found (should not happen)
                            currentGeneratedWorkout.exercises[exerciseIndex] = swappedExercise;
                         }
                    } else {
                        currentGeneratedWorkout.exercises[exerciseIndex] = swappedExercise;
                    }

                    displayGeneratedWorkout();
                }
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

            // Add Swap button if alternatives exist
            if (exercise.alternatives && exercise.alternatives.length > 0) {
                const swapButton = document.createElement('button');
                swapButton.textContent = 'Swap';
                swapButton.classList.add('swap-exercise-button');
                swapButton.setAttribute('data-index', index);
                swapButton.style.cssText = 'margin-left: 10px; padding: 2px 5px; font-size: 0.8em; background-color: #ffc107; color: #212529; border: none; border-radius: 3px;';
                li.appendChild(swapButton);
            }

            if (exercise.description) {
                const descP = document.createElement('p');
                descP.classList.add('exercise-description');
                descP.textContent = exercise.description;
                li.appendChild(descP);
            }

            if (exercise.worldRecord) {
                const wrP = document.createElement('p');
                wrP.classList.add('exercise-world-record');
                wrP.innerHTML = `🏆 <span style="font-weight:bold;">Record:</span> ${exercise.worldRecord}`;
                li.appendChild(wrP);
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

        // --- Display Warm-up Suggestions ---
        const warmupSuggestionsArea = document.getElementById('warmup-routine'); // We'll create this div in HTML
        warmupSuggestionsArea.innerHTML = ''; // Clear previous warm-ups

        let warmupKey = day.toLowerCase().split(' ')[0]; // e.g., "chest" from "Chest, Triceps, Rear Delts"
        if (trainingType.includes('CBumBodybuilding')) warmupKey = day.split(',')[0].toLowerCase(); // More specific for CBum
        else if (trainingType.includes('MitchellHooperStrongman')) warmupKey = day.split(':')[1]?.trim().split(' ')[0].toLowerCase() || 'general'; // e.g. "squat" from "Day 1: Squat & Push"
        else if (trainingType.includes('JesusOlivaresPowerlifting')) warmupKey = day.split(' ')[0].toLowerCase(); // "squat" from "Squat Day"

        const selectedWarmups = warmupExercises[warmupKey] || warmupExercises[trainingType.toLowerCase().split('(')[0].trim()] || warmupExercises.general;

        if (selectedWarmups && selectedWarmups.length > 0) {
            const warmupHeading = document.createElement('h4'); // Changed from h3 to h4 for better hierarchy
            warmupHeading.textContent = "Recommended Warm-up:";
            warmupHeading.style.marginTop = "0"; // Adjust styling as needed
            warmupSuggestionsArea.appendChild(warmupHeading);

            const wu_ul = document.createElement('ul');
            wu_ul.style.listStyleType = "'💪 '"; // Fun emoji prefix for warmups
            wu_ul.style.paddingLeft = "20px";
            selectedWarmups.forEach(warmup => {
                const wu_li = document.createElement('li');
                wu_li.innerHTML = `<strong>${warmup.name}</strong>: ${warmup.details}`;
                wu_li.style.marginBottom = "5px";
                wu_ul.appendChild(wu_li);
            });
            warmupSuggestionsArea.appendChild(wu_ul);
        }
        // --- End Warm-up Display ---

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

    // --- Plate Calculator ---
    const targetWeightInput = document.getElementById('target-weight');
    const barbellWeightInput = document.getElementById('barbell-weight');
    const calculatePlatesButton = document.getElementById('calculate-plates-button');
    const plateResultDiv = document.getElementById('plate-calculator-result');
    
    // Standard plate denominations (lbs). Assumes pairs are available.
    const standardPlates = [45, 35, 25, 10, 5, 2.5]; 

    calculatePlatesButton.addEventListener('click', () => {
        const targetWeight = parseFloat(targetWeightInput.value);
        const barWeight = parseFloat(barbellWeightInput.value);
        plateResultDiv.innerHTML = ''; // Clear previous results

        if (isNaN(targetWeight) || isNaN(barWeight) || targetWeight <= 0 || barWeight < 0) {
            plateResultDiv.textContent = 'Please enter valid positive numbers for target and bar weight.';
            plateResultDiv.style.color = 'red';
            return;
        }

        if (targetWeight < barWeight) {
            plateResultDiv.textContent = 'Target weight cannot be less than bar weight.';
            plateResultDiv.style.color = 'red';
            return;
        }

        if (targetWeight === barWeight) {
            plateResultDiv.textContent = 'No plates needed. Lift the bar!';
            plateResultDiv.style.color = 'green';
            return;
        }

        let weightToAddTotal = targetWeight - barWeight;
        if (weightToAddTotal < 0) weightToAddTotal = 0; // Should be caught by target < bar, but safety.
        
        // Ensure weight to add is divisible by the smallest increment (e.g. 2 * 2.5 = 5 for pairs)
        // Or at least an increment that makes sense with plates (e.g. 2.5 for one side for smallest plate)
        if ((weightToAddTotal % (standardPlates[standardPlates.length-1] * 2)) !== 0 && weightToAddTotal % standardPlates[standardPlates.length-1] !== 0) {
            const remainder = weightToAddTotal % (standardPlates[standardPlates.length-1] * 2);
            if(remainder !== 0 && remainder % standardPlates[standardPlates.length-1] !== 0){
                 plateResultDiv.innerHTML = `Target weight is not achievable with standard plates. <br>Weight to add (${weightToAddTotal} lbs) has a remainder that cannot be made with 2.5lb increments per side.`;
                 plateResultDiv.style.color = 'orange';
                 return;
            }
        }

        let weightPerSide = weightToAddTotal / 2.0;
        let remainingWeightPerSide = weightPerSide;
        const platesPerSide = {};

        for (const plate of standardPlates) {
            if (remainingWeightPerSide >= plate) {
                const count = Math.floor(remainingWeightPerSide / plate);
                platesPerSide[plate] = count;
                remainingWeightPerSide -= count * plate;
                remainingWeightPerSide = parseFloat(remainingWeightPerSide.toFixed(2)); // Handle potential float issues
            }
        }

        if (remainingWeightPerSide > 0) {
            // This might happen if the weight isn't perfectly divisible or due to very small float inaccuracies
            // For example, if target is 137 (bar 45 -> 92 to add -> 46 per side)
            // 1x45, remainder 1. Should try to make this with smaller plates if possible.
            // The previous check for divisibility by smallest plate * 2 should minimize this for typical scenarios.
             plateResultDiv.innerHTML = `Cannot make exact weight. <br>Remaining per side: ${remainingWeightPerSide.toFixed(2)} lbs. Try adjusting target slightly.`;
             plateResultDiv.style.color = 'orange';
             return;
        }

        let resultHTML = '<h4>Plates per side:</h4><ul>';
        let platesFound = false;
        for (const plate of standardPlates) {
            if (platesPerSide[plate] && platesPerSide[plate] > 0) {
                resultHTML += `<li>${platesPerSide[plate]} x ${plate} lbs</li>`;
                platesFound = true;
            }
        }
        if (!platesFound && weightToAddTotal > 0) {
             resultHTML += '<li>Could not determine plate combination with available plates for the weight to add.</li>';
        } else if (!platesFound && weightToAddTotal === 0) {
            resultHTML += '<li>No plates needed. Just the bar!</li>'; // Handled earlier, but as a fallback.
        }
        resultHTML += '</ul>';

        plateResultDiv.innerHTML = resultHTML;
        plateResultDiv.style.color = 'green';
    });

    // Populate Training Type options
    function populateTrainingTypeOptions() {
        // Clear existing options except the first placeholder one
        trainingTypeSelect.innerHTML = '<option value="" disabled selected>Select Training Type</option>';

        Object.keys(workouts).forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            // Add spaces before capital letters for display purposes, and handle specific names
            if (type === 'CBumBodybuilding') {
                option.textContent = 'Bodybuilding (Chris Bumstead)';
            } else if (type === 'MitchellHooperStrongman') {
                option.textContent = 'Strongman (Mitchell Hooper)';
            } else if (type === 'JesusOlivaresPowerlifting') {
                option.textContent = 'Powerlifting (Jesus Olivares)';
            } else if (type === 'bodybuilding') {
                option.textContent = 'Bodybuilding (General)';
            } else if (type === 'powerlifting') {
                option.textContent = 'Powerlifting (General)';
            } else if (type === 'strongman') {
                option.textContent = 'Strongman (General)';
            } else {
                option.textContent = type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            }
            trainingTypeSelect.appendChild(option);
        });
    }

    // Populate Day options based on selected training type
    function populateDayOptions() {
        // Clear existing options except the first placeholder one
        daySelect.innerHTML = '<option value="" disabled selected>Select Day</option>';

        const selectedTrainingType = trainingTypeSelect.value;
        if (selectedTrainingType && workouts[selectedTrainingType]) {
            const days = Object.keys(workouts[selectedTrainingType]);
            days.forEach(day => {
                const option = document.createElement('option');
                option.value = day;
                // For athlete templates, the day key is already nicely formatted.
                // For general types, we format it (e.g. 'squat_focus' -> 'Squat Focus')
                if (selectedTrainingType === 'CBumBodybuilding' || selectedTrainingType === 'MitchellHooperStrongman' || selectedTrainingType === 'JesusOlivaresPowerlifting') {
                    option.textContent = day; // Already formatted e.g. "Chest, Triceps, Rear Delts"
                } else {
                    // General types might still have underscored_names or need capitalization
                    option.textContent = day.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); 
                }
                daySelect.appendChild(option);
            });
        }
    }

    // Initial setup
    populateTrainingTypeOptions();
    // populateDayOptions(); // Will be called by event listener on trainingTypeSelect change
    updateWelcomeMessage(); // Load user if already set and display progress

    // Add event listener for training type select to update day options
    trainingTypeSelect.addEventListener('change', populateDayOptions);
}); 