import os
import json
import csv
from pathlib import Path

def get_english_questions():
    # English Marigold Chapters 1-8
    chapters = {
        "chapter_1": {
            "title": "Ice-cream Man",
            "q1": {"question": "In which season is ice-cream popular?", "answer": "Ice-cream is popular in the hot summer season.", "marks": 5},
            "q2": {"question": "Who feels joyful on seeing the Ice-cream Man?", "answer": "Children feel joyful on seeing the Ice-cream Man.", "marks": 5},
            "q3": {"question": "What are the two things that the Ice-cream Man is selling?", "answer": "He is selling cold drinks and sweet ice-cream in different flavors.", "marks": 5},
            "q4": {"question": "What is the ice-cream cart compared to in the poem?", "answer": "The ice-cream cart is compared to a flower bed of roses and sweet peas.", "marks": 5},
            "q5": {"question": "Where does the Ice-cream Man go with his cart?", "answer": "He goes through the streets of the city with his cart.", "marks": 5},
            "q6": {"question": "What flavors of ice-cream does the Ice-cream Man have in his cart?", "answer": "He has vanilla, chocolate, and strawberry flavors in his cart.", "marks": 5},
            "q7": {"question": "Describe the Ice-cream Man's cart structure.", "answer": "It is a round umbrella cart with small wheels that goes trundling down the street.", "marks": 5},
            "q8": {"question": "Why do children cluster around the Ice-cream Man?", "answer": "They cluster around him to get sweet ice-cream, like honeybees around flowers.", "marks": 5},
        },
        "chapter_2": {
            "title": "Wonderful Waste",
            "q1": {"question": "What did the cook prepare from the vegetable scraps?", "answer": "The cook washed the vegetable scraps and boiled them to prepare a new dish called Avial.", "marks": 5},
            "q2": {"question": "Why did the Maharaja enter the kitchen?", "answer": "The Maharaja entered the kitchen to inspect the dishes prepared for the grand dinner.", "marks": 5},
            "q3": {"question": "What is the name of the famous dish made from waste in Kerala?", "answer": "The famous dish made from waste in Kerala is called Avial.", "marks": 5},
            "q4": {"question": "What did the king order the cook to do with the vegetable scraps?", "answer": "The king ordered the cook to find a way to use the vegetable scraps instead of throwing them away.", "marks": 5},
            "q5": {"question": "What ingredients did the cook use to garnish Avial?", "answer": "He used coconut, green chilies, garlic, and curry leaves to garnish and flavor the dish.", "marks": 5},
            "q6": {"question": "How did the guests feel when they tasted Avial?", "answer": "All the guests loved the new dish and were eager to know its name.", "marks": 5},
            "q7": {"question": "What lesson does 'Wonderful Waste' teach us?", "answer": "It teaches us that waste materials can be recycled creatively to make something useful and wonderful.", "marks": 5},
            "q8": {"question": "Why did the cook hesitate to throw the waste at first?", "answer": "The cook hesitated because the Maharaja had strictly ordered him not to waste any vegetable scraps.", "marks": 5},
        },
        "chapter_3": {
            "title": "Robinson Crusoe",
            "q1": {"question": "Why was Robinson Crusoe afraid when he saw the footprint?", "answer": "He was afraid because he thought it belonged to a savage who might kill and eat him.", "marks": 5},
            "q2": {"question": "Where did Robinson Crusoe find the footprint?", "answer": "He found the footprint on the sand of the seashore.", "marks": 5},
            "q3": {"question": "How did Robinson Crusoe confirm it was a human footprint?", "answer": "He examined it closely and saw that it had toes, a heel, and every part of a human foot.", "marks": 5},
            "q4": {"question": "Where did Robinson Crusoe live on the island?", "answer": "He lived in a cave which he called his castle, surrounded by a strong fence.", "marks": 5},
            "q5": {"question": "What did Robinson Crusoe do to protect himself after seeing the footprint?", "answer": "He ran back to his cave, locked himself inside, and prayed to God for protection.", "marks": 5},
            "q6": {"question": "What feeling did Crusoe experience when he stayed in his cave for days?", "answer": "He felt a mix of intense fear, curiosity, and loneliness, keeping him awake at night.", "marks": 5},
        },
        "chapter_4": {
            "title": "Crying",
            "q1": {"question": "According to the poet, how much should you cry?", "answer": "You should cry until your pillow is completely soaked with tears, so you can wash your sorrow away.", "marks": 5},
            "q2": {"question": "What can you do after crying a lot?", "answer": "After crying a lot, you can jump in the shower and splash water to feel happy and refreshed.", "marks": 5},
            "q3": {"question": "What will people ask when they see you happy after crying?", "answer": "People will ask what is going on up there, and you can tell them that happiness was hiding in the last tear.", "marks": 5},
            "q4": {"question": "What does the poet mean by saying 'crying only a little bit is no use'?", "answer": "It means half-hearted crying doesn't relieve your mind; you must let your emotions flow completely.", "marks": 5},
            "q5": {"question": "Why does the poet suggest taking a bath after crying?", "answer": "To wash away the sadness and feel physically and mentally refreshed and clean.", "marks": 5},
        },
        "chapter_5": {
            "title": "My Shadow",
            "q1": {"question": "Who does the shadow go in and out with?", "answer": "The shadow goes in and out with the child.", "marks": 5},
            "q2": {"question": "What is the funniest thing about the shadow?", "answer": "The funniest thing is the way it likes to grow, sometimes very tall and sometimes very small.", "marks": 5},
            "q3": {"question": "What does the shadow look like?", "answer": "The shadow looks exactly like the child from the heels up to the head.", "marks": 5},
            "q4": {"question": "What is the relation between light and the shadow?", "answer": "The shadow needs light to exist; without light, it disappears or stays asleep.", "marks": 5},
        },
        "chapter_6": {
            "title": "Class Discussion",
            "q1": {"question": "Who was the quiet one in the class discussion?", "answer": "Jane was the quiet student who sat and stared in silence during the class discussion.", "marks": 5},
            "q2": {"question": "What did the teacher ask Jane in the discussion?", "answer": "The teacher asked Jane why she was so quiet and why she did not participate in the talk.", "marks": 5},
            "q3": {"question": "Who conducted the class discussion?", "answer": "The teacher conducted the class discussion.", "marks": 5},
            "q4": {"question": "What is the message of the poem 'Class Discussion'?", "answer": "The poem teaches us to accept and value all personality types, including quiet and reflective people.", "marks": 5},
        },
        "chapter_7": {
            "title": "Topsy-turvy Land",
            "q1": {"question": "How do people walk in Topsy-turvy Land?", "answer": "People walk on their heads in Topsy-turvy Land.", "marks": 5},
            "q2": {"question": "When do children go to school in Topsy-turvy Land?", "answer": "Children go to school at night in Topsy-turvy Land.", "marks": 5},
            "q3": {"question": "What is unusual about the hats in Topsy-turvy Land?", "answer": "People wear their hats on their feet instead of on their heads.", "marks": 5},
            "q4": {"question": "How do you pay for things in Topsy-turvy Land?", "answer": "You pay for what you never get, which means buying things you do not receive.", "marks": 5},
        },
        "chapter_8": {
            "title": "Gulliver's Travels",
            "q1": {"question": "Who was Gulliver?", "answer": "Gulliver was a ship's doctor who loved traveling to far-off places and got shipwrecked.", "marks": 5},
            "q2": {"question": "How did Gulliver describe the giants' voices?", "answer": "He described their voices as loud as thunder, which hurt his ears.", "marks": 5},
            "q3": {"question": "What did the giant farmer do when he first found Gulliver?", "answer": "He picked Gulliver up between his thumb and forefinger and looked at him with curiosity.", "marks": 5},
            "q4": {"question": "Who looked after Gulliver in the giant's household?", "answer": "The farmer's nine-year-old daughter, whom he called Glumdalclitch, looked after him.", "marks": 5},
        },
    }
    return chapters

def get_hindi_questions():
    # Hindi Rimjhim / Vasant Chapters 1-8
    chapters = {
        "chapter_1": {
            "title": "पाठ 1 — ध्वनि",
            "q1": {"question": "कवि को ऐसा विश्वास क्यों है कि उसका अंत अभी नहीं होगा?", "answer": "कवि के जीवन में अभी-अभी वसंत रूपी नए उत्साह का आगमन हुआ है। जब तक वह आलसी युवाओं में नवजीवन का संचार नहीं कर देता, तब तक उसका अंत नहीं होगा।", "marks": 5},
            "q2": {"question": "फूलों को अनंत तक विकसित करने के लिए कवि कौन-कौन सा प्रयास करता है?", "answer": "कवि फूलों की तंद्रा (नींद) और आलस्य को दूर भगाने के लिए उन पर अपने स्पर्श से नया सवेरा लाना चाहता है तथा नवजीवन का अमृत सींचता है।", "marks": 5},
            "q3": {"question": "कवि पुष्पों की तंद्रा और आलस्य दूर हटाने के लिए क्या करना चाहता है?", "answer": "कवि अपने जीवन के अमृत से सींचकर पुष्पों को नए सवेरे का संदेश देना चाहता है ताकि वे अनंत तक खिलते रहें।", "marks": 5},
            "q4": {"question": "कविता 'ध्वनि' के रचयिता कौन हैं?", "answer": "कविता 'ध्वनि' के रचयिता प्रसिद्ध महान कवि सूर्यकांत त्रिपाठी 'निराला' जी हैं।", "marks": 5},
        },
        "chapter_2": {
            "title": "पाठ 2 — बचपन",
            "q1": {"question": "लेखिका बचपन में इतवार की सुबह क्या-क्या काम करती थीं?", "answer": "लेखिका इतवार की सुबह अपने मोज़े धोती थीं और अपने जूतों पर पॉलिश करके उन्हें चमकाती थीं।", "marks": 5},
            "q2": {"question": "लेखिका को चश्मा क्यों लगाना पड़ा?", "answer": "दिन की रोशनी छोड़कर रात में टेबल लैंप के सामने काम करने के कारण उनकी नज़र कमज़ोर हो गई थी, इसलिए चश्मा लगाना पड़ा।", "marks": 5},
            "q3": {"question": "चश्मा लगाने पर चचेरे भाई लेखिका को क्या कहकर चिढ़ाते थे?", "answer": "चचेरे भाई उन्हें चिढ़ाते हुए कहते थे—'आंख पर चश्मा लगाया ताकि सूझे दूर की, यह नहीं लड़की को मालूम सूरत बनी लंगूर की।'", "marks": 5},
        },
        "chapter_3": {
            "title": "पाठ 3 — नादान दोस्त",
            "q1": {"question": "केशव और श्यामा के मन में अंडों को देखकर क्या-क्या सवाल उठते थे?", "answer": "उनके मन में सवाल उठते थे कि अंडे कितने बड़े होंगे, किस रंग के होंगे, उनमें से बच्चे कैसे निकलेंगे और वे क्या खाते होंगे।", "marks": 5},
            "q2": {"question": "केशव ने अंडों की सुरक्षा के लिए क्या-क्या उपाय किए?", "answer": "केशव ने अंडों के नीचे कपड़े की गद्दी बिछाई, धूप से बचाने के लिए टोकरी की छत बनाई और दाना-पानी कार्निस पर रख दिया।", "marks": 5},
            "q3": {"question": "अंडे नीचे गिरकर क्यों टूट गए?", "answer": "केशव के छूने से चिड़िया के अंडे गंदे हो गए थे, इसलिए चिड़िया ने उन्हें गंदा समझकर घोंसले से नीचे गिरा दिया।", "marks": 5},
        },
        "chapter_4": {
            "title": "पाठ 4 — चाँद से थोड़ी सी गप्पें",
            "q1": {"question": "लड़की चाँद से क्या बातें करती है?", "answer": "लड़की चाँद से कहती है कि आप गोल हैं पर तिरछे नज़र आते हैं और आपने आकाश रूपी तारों जड़ा वस्त्र पहन रखा है।", "marks": 5},
            "q2": {"question": "चाँद की घटती-बढ़ती कला को लड़की क्या बीमारी मानती है?", "answer": "लड़की मानती है कि घटते हैं तो घटते ही चले जाते हैं और बढ़ते हैं तो बिल्कुल गोल होने तक बढ़ते ही रहते हैं, यह उनकी एक बीमारी है।", "marks": 5},
        },
        "chapter_5": {
            "title": "पाठ 5 — अक्षरों का महत्व",
            "q1": {"question": "अक्षरों की खोज का क्या महत्व है?", "answer": "अक्षरों की खोज के बाद ही मनुष्य ने अपने विचारों और इतिहास को लिखना शुरू किया, जिससे मानव सभ्यता का विकास हुआ।", "marks": 5},
            "q2": {"question": "अक्षरों की खोज से पहले मनुष्य अपनी बात दूसरों तक कैसे पहुँचाता था?", "answer": "मनुष्य पशु-पक्षियों, आदमियों और संकेतों के चित्र बनाकर अपनी बात दूसरों तक पहुँचाता था।", "marks": 5},
        },
        "chapter_6": {
            "title": "पाठ 6 — पार नज़र के",
            "q1": {"question": "छोटू का परिवार कहाँ रहता था?", "answer": "छोटू का परिवार मंगल ग्रह पर ज़मीन के नीचे बनी एक सुरंगनुमा कॉलोनी में रहता था।", "marks": 5},
            "q2": {"question": "छोटू को सुरंग में जाने की इजाज़त क्यों नहीं थी?", "answer": "सुरंग में आम लोगों का जाना मना था क्योंकि वहाँ जाने के लिए खास स्पेस सूट और प्रशिक्षण की आवश्यकता होती थी।", "marks": 5},
        },
        "chapter_7": {
            "title": "पाठ 7 — साथी हाथ बढ़ाना",
            "q1": {"question": "गीत 'साथी हाथ बढ़ाना' में एक-एक कतरा और राई के मिलने से क्या बनता है?", "answer": "एक-एक कतरा मिलने से दरिया बनता है और एक-एक राई का दाना मिलने से पर्वत बन सकता है।", "marks": 5},
            "q2": {"question": "इस गीत से हमें क्या प्रेरणा मिलती है?", "answer": "इस गीत से हमें एकता, संगठन और मिल-जुलकर कठिन से कठिन काम पूरा करने की प्रेरणा मिलती है।", "marks": 5},
        },
        "chapter_8": {
            "title": "पाठ 8 — ऐसे-ऐसे",
            "q1": {"question": "मोहन 'ऐसे-ऐसे' का बहाना क्यों बना रहा था?", "answer": "मोहन ने स्कूल का गृहकार्य (होमवर्क) पूरा नहीं किया था, इसलिए स्कूल न जाने के लिए पेट में 'ऐसे-ऐसे' दर्द का बहाना बना रहा था।", "marks": 5},
            "q2": {"question": "वैद्य जी और डॉक्टर जी ने मोहन को क्या बीमारी बताई?", "answer": "वैद्य जी ने वात का प्रकोप और बदहज़मी बताया, जबकि मास्टर जी ने समझ लिया कि यह केवल स्कूल का काम न करने का डर है।", "marks": 5},
        },
    }
    return chapters

def get_maths_questions():
    # Maths Math Magic Chapters 1-8
    chapters = {
        "chapter_1": {
            "title": "The Fish Tale",
            "q1": {"question": "A log boat travels 4 km in 1 hour. How long will it take to go 20 km?", "answer": "It will take 5 hours to travel 20 km because 20 divided by 4 is 5.", "marks": 5},
            "q2": {"question": "If 1 kg of fresh fish cost Rs 150, what is the cost of 6 kg of fresh fish?", "answer": "The cost of 6 kg of fresh fish is Rs 900 because 150 times 6 is 900.", "marks": 5},
            "q3": {"question": "Write the number one lakh in figures.", "answer": "One lakh is written as 1,00,000.", "marks": 5},
            "q4": {"question": "A motor boat goes at a speed of 20 km per hour. How far can it go in 3.5 hours?", "answer": "It can travel 70 km because 20 times 3.5 is 70.", "marks": 5},
        },
        "chapter_2": {
            "title": "Shapes and Angles",
            "q1": {"question": "What is the measure of a right angle?", "answer": "A right angle measures exactly 90 degrees.", "marks": 5},
            "q2": {"question": "An angle measures 45 degrees. What type of angle is it?", "answer": "It is an acute angle because it is less than 90 degrees.", "marks": 5},
            "q3": {"question": "What type of angle is formed between the hands of a clock at 3 o'clock?", "answer": "A right angle of 90 degrees is formed at 3 o'clock.", "marks": 5},
            "q4": {"question": "What is the sum of angles in a triangle?", "answer": "The sum of angles in a triangle is 180 degrees.", "marks": 5},
        },
        "chapter_3": {
            "title": "How Many Squares?",
            "q1": {"question": "Find the perimeter of a rectangle with length 6 cm and width 4 cm.", "answer": "The perimeter is 20 cm because 2 times (6 + 4) equals 20.", "marks": 5},
            "q2": {"question": "If a square has a side length of 5 cm, what is its area?", "answer": "The area is 25 square cm because 5 times 5 is 25.", "marks": 5},
            "q3": {"question": "What is the perimeter of a square with a side length of 8 cm?", "answer": "The perimeter is 32 cm because 4 times 8 is 32.", "marks": 5},
        },
        "chapter_4": {
            "title": "Parts and Wholes",
            "q1": {"question": "What fraction of a day is 8 hours?", "answer": "It is 1/3 of a day because 8/24 simplifies to 1/3.", "marks": 5},
            "q2": {"question": "Find 3/4 of 20 rupees.", "answer": "It is 15 rupees because 20 divided by 4 is 5, and 5 times 3 is 15.", "marks": 5},
            "q3": {"question": "What fraction of an hour is 15 minutes?", "answer": "It is 1/4 of an hour because 15/60 simplifies to 1/4.", "marks": 5},
        },
        "chapter_5": {
            "title": "Does it Look the Same?",
            "q1": {"question": "Does the letter 'H' look the same after a half turn?", "answer": "Yes, the letter H looks the same after a half turn because of vertical and horizontal symmetry.", "marks": 5},
            "q2": {"question": "Does a circle have line symmetry?", "answer": "Yes, a circle has infinite lines of symmetry passing through its center.", "marks": 5},
            "q3": {"question": "What fraction of a turn does a square need to look the same?", "answer": "A square needs a 1/4 turn (or 90 degrees) to look exactly the same.", "marks": 5},
        },
        "chapter_6": {
            "title": "Be My Multiple, I'll be Your Factor",
            "q1": {"question": "What is the smallest common multiple of 3 and 4?", "answer": "The smallest common multiple of 3 and 4 is 12.", "marks": 5},
            "q2": {"question": "Find the factors of 12.", "answer": "The factors of 12 are 1, 2, 3, 4, 6, and 12.", "marks": 5},
            "q3": {"question": "What is the highest common factor (HCF) of 15 and 20?", "answer": "The highest common factor of 15 and 20 is 5.", "marks": 5},
        },
        "chapter_7": {
            "title": "Can You See the Pattern?",
            "q1": {"question": "What is the next number in the pattern: 2, 4, 8, 16, ...?", "answer": "The next number is 32 because each term is multiplied by 2.", "marks": 5},
            "q2": {"question": "Complete the pattern: 100, 90, 80, 70, ...?", "answer": "The next number is 60 because we subtract 10 at each step.", "marks": 5},
            "q3": {"question": "What is a magic square?", "answer": "A magic square is a grid of numbers where the sum of numbers in each row, column, and diagonal is the same.", "marks": 5},
        },
        "chapter_8": {
            "title": "Mapping Your Way",
            "q1": {"question": "On a map, 1 cm represents 2 km. If the distance between two towns is 5 cm on the map, what is the actual distance?", "answer": "The actual distance is 10 km because 5 times 2 is 10.", "marks": 5},
            "q2": {"question": "What are the four main directions on a compass/map?", "answer": "The four main directions are North, South, East, and West.", "marks": 5},
            "q3": {"question": "What does a map scale help us do?", "answer": "A map scale helps us measure the actual distance between places using a scaled-down representation.", "marks": 5},
        },
    }
    return chapters

def get_evs_questions():
    # EVS Looking Around Chapters 1-8
    chapters = {
        "chapter_1": {
            "title": "Super Senses",
            "q1": {"question": "Name two animals that have a very strong sense of smell.", "answer": "Dogs and ants have an exceptionally strong sense of smell to track food and paths.", "marks": 5},
            "q2": {"question": "How do ants recognize their friends?", "answer": "Ants recognize their friends by their group's unique chemical smell left on the ground.", "marks": 5},
            "q3": {"question": "Why do birds move their necks very often?", "answer": "Birds move their necks because their eyes are fixed and cannot move in their sockets.", "marks": 5},
            "q4": {"question": "Which animal can feel vibrations on the ground through its skin?", "answer": "Snakes feel vibrations on the ground because they do not have external ears.", "marks": 5},
        },
        "chapter_2": {
            "title": "A Snake Charmer's Story",
            "q1": {"question": "Who are Kalbeliyas?", "answer": "Kalbeliyas are nomadic people famous for their snake-charming skills and traditional snake dances.", "marks": 5},
            "q2": {"question": "Which musical instrument is played by snake charmers to make snakes dance?", "answer": "Snake charmers play the been to make snakes sway to its movements.", "marks": 5},
            "q3": {"question": "Why are snakes called friends of farmers?", "answer": "They are friends because they eat rats in the fields, which prevents damage to crops.", "marks": 5},
        },
        "chapter_3": {
            "title": "From Tasting to Digesting",
            "q1": {"question": "Where does digestion of food start in our body?", "answer": "Digestion of food starts in our mouth with the help of saliva.", "marks": 5},
            "q2": {"question": "What is the function of saliva in digestion?", "answer": "Saliva softens food and breaks down starch into simple sugars.", "marks": 5},
            "q3": {"question": "What is glucose drip given for?", "answer": "A glucose drip is given to provide instant energy and strength to a weak patient.", "marks": 5},
        },
        "chapter_4": {
            "title": "Mangoes Round the Year",
            "q1": {"question": "What is Mamidi Tandra?", "answer": "Mamidi Tandra is a traditional sweet mango jelly made in Andhra Pradesh using mango pulp and sugar.", "marks": 5},
            "q2": {"question": "Why do we preserve food items?", "answer": "We preserve food to prevent the growth of bacteria and fungus, keeping it fresh for a longer time.", "marks": 5},
            "q3": {"question": "Name two methods of food preservation.", "answer": "Two methods are drying (dehydration) and pickling using oil and salt.", "marks": 5},
        },
        "chapter_5": {
            "title": "Seeds and Seeds",
            "q1": {"question": "Name the conditions required for a seed to sprout.", "answer": "A seed requires air, water, and warm temperature to sprout or germinate.", "marks": 5},
            "q2": {"question": "What is a pitcher plant (Nepenthes)?", "answer": "A pitcher plant is an insect-eating plant that traps frogs, insects, and mice using a sweet smell.", "marks": 5},
            "q3": {"question": "How do seeds travel to far-off places?", "answer": "Seeds travel through wind, water, sticking to animal fur, or being eaten and dispersed by birds.", "marks": 5},
        },
        "chapter_6": {
            "title": "Every Drop Counts",
            "q1": {"question": "What is a stepwell (Baoli)?", "answer": "A stepwell is a deep well with steps on all sides, allowing people to go down to fetch water.", "marks": 5},
            "q2": {"question": "Who built the Ghadsisar lake and where is it?", "answer": "King Ghadsi of Jaisalmer built the lake Ghadsisar in Rajasthan over 650 years ago.", "marks": 5},
            "q3": {"question": "How is rainwater harvesting helpful?", "answer": "Rainwater harvesting collects rain from roofs into underground tanks to recharge groundwater.", "marks": 5},
        },
        "chapter_7": {
            "title": "Experiments with Water",
            "q1": {"question": "Why does an iron nail sink in water while a plastic bottle floats?", "answer": "An iron nail is denser than water so it sinks, while a plastic bottle is less dense and floats.", "marks": 5},
            "q2": {"question": "What makes the Dead Sea special?", "answer": "The Dead Sea is extremely salty, containing 300g of salt per liter, which makes water so dense that humans float on it easily.", "marks": 5},
            "q3": {"question": "Who led the Dandi March and why?", "answer": "Mahatma Gandhi led the Dandi March in 1930 to protest against the British salt law.", "marks": 5},
        },
        "chapter_8": {
            "title": "A Treat for Mosquitoes",
            "q1": {"question": "Which disease is caused by the bite of a female Anopheles mosquito?", "answer": "Malaria is caused by the bite of a female Anopheles mosquito.", "marks": 5},
            "q2": {"question": "What medicine was traditionally used to cure Malaria?", "answer": "The powdered bark of the Cinchona tree was traditionally used to cure Malaria.", "marks": 5},
            "q3": {"question": "What is Anaemia and what causes it?", "answer": "Anaemia is a disease caused by the lack of hemoglobin or iron in the blood, making a person feel weak.", "marks": 5},
        },
    }
    return chapters

def build_dataset_samples(all_subjects):
    samples = []
    
    for subject, chapters in all_subjects.items():
        is_hindi = (subject == "hindi")
        
        for ch_key in sorted(chapters.keys()):
            ch_data = chapters[ch_key]
            ch_title = ch_data["title"]
            questions = {k: v for k, v in ch_data.items() if k != "title"}
            
            for q_key, payload in questions.items():
                question = payload["question"]
                expected = payload["answer"]
                max_marks = payload["marks"]
                
                # Variant 1: Full Marks (Correct)
                correct_marks = max_marks
                if is_hindi:
                    correct_student = expected
                    correct_feedback = "उत्कृष्ट उत्तर! आपने प्रश्न का सही और स्पष्ट उत्तर दिया है।"
                    correct_param = "पूर्ण उत्तर एवं अवधारणा स्पष्टता (Conceptual Accuracy)"
                else:
                    correct_student = expected
                    correct_feedback = f"Excellent answer! You explained the concept of {ch_title} very clearly."
                    correct_param = "Conceptual Understanding & Factual Accuracy"
                
                # Variant 2: Partial Marks (Needs Detail)
                partial_marks = 3
                if is_hindi:
                    words = expected.split()
                    partial_student = " ".join(words[:len(words)//2]) + "।" if len(words) > 3 else words[0]
                    partial_feedback = "अच्छा प्रयास! आपने कुछ मुख्य बिंदु लिखे हैं, पर उत्तर को पूर्ण करने के लिए थोड़े और विवरण की आवश्यकता है।"
                    partial_param = "आंशिक उत्तर (Partial Concept Recall)"
                else:
                    words = expected.split()
                    partial_student = " ".join(words[:len(words)//2]) + "." if len(words) > 3 else words[0]
                    partial_feedback = "Good attempt. You mentioned some correct points, but please add more details for a complete explanation."
                    partial_param = "Incomplete Explanation"
                
                # Variant 3: Zero Marks (Incorrect / Unknown)
                wrong_marks = 0
                if is_hindi:
                    wrong_student = "मुझे इस प्रश्न का उत्तर नहीं पता है।"
                    wrong_feedback = "इस उत्तर में अधिक प्रयास और विषय की बेहतर समझ की आवश्यकता है।"
                    wrong_param = "अनुत्तरित / अपर्याप्त ज्ञान (No Attempt)"
                else:
                    wrong_student = "I don't know the answer to this question."
                    wrong_feedback = "This answer needs more effort and a clearer understanding of the topic."
                    wrong_param = "Missing Knowledge"
                
                variants = [
                    (correct_student, correct_marks, correct_feedback, correct_param),
                    (partial_student, partial_marks, partial_feedback, partial_param),
                    (wrong_student, wrong_marks, wrong_feedback, wrong_param),
                ]
                
                for stud, mk, fb, param in variants:
                    prompt = (
                        f"Subject: {subject}\n"
                        f"Chapter: {ch_title}\n"
                        f"Question: {question}\n"
                        f"Expected Answer: {expected}\n"
                        f"Student Answer: {stud}\n"
                        "Evaluate the student's answer. Return: marks out of 5, feedback, and evaluation_parameter."
                    )
                    response = f"{mk}/5 | Parameter: {param} | Feedback: {fb}"
                    
                    samples.append({
                        "subject": subject,
                        "chapter": ch_key,
                        "chapter_title": ch_title,
                        "question": question,
                        "expected_answer": expected,
                        "student_answer": stud,
                        "marks": mk,
                        "max_marks": max_marks,
                        "feedback": fb,
                        "evaluation_parameter": param,
                        "prompt": prompt,
                        "response": response
                    })
                    
    return samples

def main():
    print("Reconstructing NCERT Fine-Tuning Sample Dataset...")
    all_subjects = {
        "english": get_english_questions(),
        "hindi": get_hindi_questions(),
        "maths": get_maths_questions(),
        "evs": get_evs_questions()
    }
    
    data_dir = Path("data/answer_bank")
    data_dir.mkdir(parents=True, exist_ok=True)
    
    # Save raw answer bank JSON
    json_path = data_dir / "ncert_answers.json"
    json_path.write_text(json.dumps(all_subjects, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Saved raw answer bank JSON to {json_path}")
    
    # Generate structured dataset samples
    samples = build_dataset_samples(all_subjects)
    print(f"Generated {len(samples)} total fine-tuning samples across 4 subjects.")
    
    fieldnames = [
        "subject",
        "chapter",
        "chapter_title",
        "question",
        "expected_answer",
        "student_answer",
        "marks",
        "max_marks",
        "feedback",
        "evaluation_parameter",
        "prompt",
        "response"
    ]
    
    # Save training CSV
    csv_path = data_dir / "fine_tuning_samples.csv"
    with open(csv_path, mode="w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(samples)
    print(f"Saved fine-tuning samples CSV to {csv_path}")
    
    # Save training JSON
    dataset_json_path = data_dir / "fine_tuning_dataset.json"
    dataset_json_path.write_text(json.dumps(samples, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Saved dataset JSON to {dataset_json_path}")

if __name__ == "__main__":
    main()
