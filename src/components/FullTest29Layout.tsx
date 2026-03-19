import React, { useEffect, useState, useRef } from 'react';
import '../styles/fullTest29.css';

interface FullTest29LayoutProps {
  onBack: () => void;
}

export default function FullTest29Layout({ onBack }: FullTest29LayoutProps) {
  const [score, setScore] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Original Logic Implementation ---
    let timeInSeconds = 3600;
    let timerInterval: any;
    let currentPassage = 1;
    let currentQuestion = 1;

    const correctAnswers: Record<string, string> = {
        '1': 'less than £1,000', '2': 'less than £5,000', '3': '£1,000 to £1,500', '4': '£7,000 to £10,000', '5': '£6,000 to £8,000',
        '6': 'vii', '7': 'ii', '8': 'v', '9': 'iii',
        '10': 'TRUE', '11': 'TRUE', '12': 'FALSE', '13': 'FALSE',
        '14': 'A', '15': 'A', '16': 'C', '17': 'B', '18': 'H', '19': 'D',
        '20': 'C', '21': 'A', '22': 'B',
        '23': 'fruit', '24': 'toxin', '25': 'reproduction', '26': 'water', '27': 'drought',
        '28': 'vi', '29': 'iii', '30': 'ii', '31': 'i', '32': 'viii',
        '33': 'B', '34': 'C', '35': 'D',
        '36': 'football crowds and city parks', '37': 'private security firms',
        '38': 'YES', '39': 'NOT GIVEN', '40': 'YES'
    };

    const timerDisplay = containerRef.current.querySelector('.timer-display');
    const timerToggleButton = containerRef.current.querySelector('#timer-toggle-btn');
    const timerResetButton = containerRef.current.querySelector('#timer-reset-btn');
    const deliverButton = containerRef.current.querySelector('#deliver-button');
    const resizer = containerRef.current.querySelector('#resizer');
    const passagePanel = containerRef.current.querySelector('#passage-panel');

    const updateTimerDisplay = () => {
        if (!timerDisplay) return;
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeInSeconds--;
            updateTimerDisplay();
            if (timeInSeconds <= 0) {
                clearInterval(timerInterval);
                if (timerDisplay) timerDisplay.textContent = "Time's up!";
            }
        }, 1000);
        if (timerToggleButton) {
            timerToggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        }
    };

    const pauseTimer = () => {
        clearInterval(timerInterval);
        if (timerToggleButton) {
            timerToggleButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8 5v14l11-7L8 5z"/></svg>';
        }
    };

    const switchToPart = (partNumber: number) => {
        currentPassage = partNumber;
        containerRef.current?.querySelectorAll('.reading-passage, .question-set, .part-header').forEach(el => {
            (el as HTMLElement).classList.add('hidden');
        });
        (containerRef.current?.querySelector(`#passage-text-${partNumber}`) as HTMLElement)?.classList.remove('hidden');
        (containerRef.current?.querySelector(`#questions-${partNumber}`) as HTMLElement)?.classList.remove('hidden');
        (containerRef.current?.querySelector(`#part-header-${partNumber}`) as HTMLElement)?.classList.remove('hidden');

        containerRef.current?.querySelectorAll('.footer__questionWrapper___1tZ46').forEach((wrapper) => {
            (wrapper as HTMLElement).classList.toggle('selected', (wrapper.id || "").includes(`wrapper-${partNumber}`)); // I should add IDs to wrappers
        });
        
        const firstQuestion = {1: 1, 2: 14, 3: 28}[partNumber] || 1;
        goToQuestion(firstQuestion);
    };

    const goToQuestion = (qNum: number) => {
        currentQuestion = qNum;
        const navButtons = containerRef.current?.querySelectorAll('.subQuestion');
        navButtons?.forEach(btn => btn.classList.remove('active'));
        const activeNav = Array.from(navButtons || []).find(btn => (btn as HTMLElement).innerText === qNum.toString());
        activeNav?.classList.add('active');

        const questionEl = containerRef.current?.querySelector(`[data-q-start="${qNum}"]`);
        if (questionEl) {
            questionEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const input = questionEl.querySelector('input, select');
            (input as HTMLElement)?.focus();
        }
    };

    const checkAnswers = () => {
        let sc = 0;
        const resultsDetails: any[] = [];
        
        for (let i = 1; i <= 40; i++) {
            const correctAnswer = correctAnswers[i];
            let isCorrect = false;
            let userAnswer = '';

            const input = containerRef.current?.querySelector(`#q${i}`) as HTMLInputElement | HTMLSelectElement;
            const radios = containerRef.current?.querySelectorAll(`input[name="q${i}"]`) as NodeListOf<HTMLInputElement>;
            
            if (input && input.tagName !== 'INPUT' || (input && (input as HTMLInputElement).type === 'text')) {
                userAnswer = input.value.trim();
                isCorrect = userAnswer.toLowerCase() === correctAnswer.toLowerCase();
            } else if (radios.length > 0) {
                const checked = Array.from(radios).find(r => r.checked);
                userAnswer = checked ? checked.value : '';
                isCorrect = userAnswer === correctAnswer;
            }

            if (isCorrect) sc++;
            
            // Mark visually
            const navBtn = Array.from(containerRef.current?.querySelectorAll('.subQuestion') || []).find(btn => (btn as HTMLElement).innerText === i.toString());
            (navBtn as HTMLElement)?.classList.add(isCorrect ? 'correct' : 'incorrect');
        }

        setScore(sc);
        clearInterval(timerInterval);
        containerRef.current?.querySelector('#results-modal')?.classList.remove('hidden');
    };

    // --- Setup Listeners ---
    timerToggleButton?.addEventListener('click', () => {
        const isPlaying = timerToggleButton.innerHTML.includes('M6 19h4V5H6v14z');
        if (isPlaying) pauseTimer(); else startTimer();
    });

    timerResetButton?.addEventListener('click', () => {
        timeInSeconds = 3600;
        updateTimerDisplay();
        startTimer();
    });

    deliverButton?.addEventListener('click', checkAnswers);

    containerRef.current.querySelectorAll('.footer__questionNo___3WNct').forEach((btn, i) => {
        btn.addEventListener('click', () => switchToPart(i + 1));
    });

    containerRef.current.querySelectorAll('.subQuestion').forEach((btn) => {
        btn.addEventListener('click', () => goToQuestion(parseInt((btn as HTMLElement).innerText)));
    });

    // Navigation arrows
    containerRef.current.querySelector('.nav-arrow:first-child')?.addEventListener('click', () => currentQuestion > 1 && goToQuestion(currentQuestion - 1));
    containerRef.current.querySelector('.nav-arrow:last-child')?.addEventListener('click', () => currentQuestion < 40 && goToQuestion(currentQuestion + 1));

    // Resizer
    let isResizing = false;
    resizer?.addEventListener('mousedown', (e) => {
        isResizing = true;
        e.preventDefault();
    });

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing || !passagePanel) return;
        const newWidth = e.clientX;
        if (newWidth > 200 && newWidth < window.innerWidth - 200) {
            (passagePanel as HTMLElement).style.flex = `0 0 ${newWidth}px`;
        }
    };

    const handleMouseUp = () => { isResizing = false; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Initial state
    startTimer();
    switchToPart(1);

    return () => {
        clearInterval(timerInterval);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="full-test-29-container" ref={containerRef}>
      <div className="header">
        <button onClick={onBack} className="bg-slate-100 px-4 py-2 rounded-lg font-bold border border-slate-300 hover:bg-slate-200 transition-colors">
          &larr; Exit Test
        </button>
        <div className="timer-container">
            <span className="timer-display">60:00</span>
            <div className="timer-controls">
                <button id="timer-toggle-btn" title="Pause/Resume Timer">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8 5v14l11-7L8 5z"/></svg>
                </button>
                <button id="timer-reset-btn" title="Reset Timer">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
                </button>
            </div>
        </div>
        <a href="https://t.me/muminov_bar" target="_blank" rel="noreferrer" className="telegram-link">
            Full Exam Materials
        </a>
      </div>

      <div className="main-container">
        <div id="passage-header-container">
            <div id="part-header-1" class="part-header">
                <p><strong>Part 1</strong></p>
                <p>Read the text and answer questions 1-13.</p>
            </div>
            <div id="part-header-2" class="part-header hidden">
                <p><strong>Part 2</strong></p>
                <p>Read the text and answer questions 14-27.</p>
            </div>
            <div id="part-header-3" class="part-header hidden">
                <p><strong>Part 3</strong></p>
                <p>Read the text and answer questions 28-40.</p>
            </div>
        </div>
        <div className="panels-container">
            <div className="passage-panel" id="passage-panel">
                <div id="passage-text-1" className="reading-passage">
                    <h4 className="text-center">Affordable Art</h4>
                    <p>Art prices have fallen drastically. The art market is being flooded with good material, much of it from big-name artists, including Pablo Picasso and Andy Warhol. Many pieces sell for less than you might expect, with items that would have made £20,000 two years ago fetching only £5,000 to £10,000 this autumn, according to Philip Hoffman, chief executive of the Fine Art Fund. Here, we round up what is looking cheap now, with a focus on works in the range of £500 to £10,000.</p>
                    <p>Picasso is one of the most iconic names in art, yet some of his ceramics and lithographs fetched less than £1,000 each at Bonhams on Thursday. The low prices are because he produced so many of them. However, their value has increased steadily and his works will only become scarcer as examples are lost.</p>
                    <p>Nic McElhatton, the chairman of Christie's South Kensington, says that the biggest 'affordable' category for top artists is 'multiples' - prints such as screenprints or lithographs in limited editions. In a Christie's sale this month, examples by Picasso, Matisse, Miró and Steinlen sold for less than £5,000 each.</p>
                    <p>Alexandra Gill, the head of prints at the auction house, says that some prints are heavily hand-worked, or often coloured, by the artist, making them personalised. 'Howard Hodgkin's are a good example,' she says. 'There's still prejudice against prints, but for the artist it was another, equal, medium.</p>
                    <p>Mr Hoffman believes that these types of works are currently about as 'cheap as they can get' and will hold their value in the long run - though he admits that their sheer number means prices are unlikely to rise any time soon.</p>
                    <p>It can be smarter to buy really good one-offs from lesser-known artists, he adds. A limited budget will not run to the blockbuster names you can obtain with multiples, but it will buy you work by Royal Academicians (RAs) and others whose pieces are held in national collections and who are given long write-ups in the art history books. For example, the Christie's sale of art from the Lehman Brothers collection on Wednesday will include Valley with cornflowers in oil by Anthony Gross (22 of whose works are held by the Tate), at £1,000 to £1,500. There is no reserve on items with estimates of £1,000 or less, and William Porter, who is in charge of the sale, expects some lots to go for 'very little'. The sale also has oils by the popular Mary Fedden (whose works are often reproduced on greetings cards), including Spanish House and The White Hyacinth, at £7,000 to £10,000 each.</p>
                    <p>Large works by important Victorian painters are available in this sort of price range, too. These are affordable because their style has come to be considered 'uncool', but they please a large traditionalist following nonetheless. For example, the sale of 19th-century paintings at Bonhams on Wednesday has a Hampstead landscape by Frederick William Watts at £6,000 to £8,000 and a study of three Spanish girls by John Bagnold Burgess at £4,000 to £6,000. There are proto-social realist works depicting poverty, too, such as Uncared For by Augustus Edwin Mulready, at £10,000 to £15,000.</p>
                    <p>Smaller auction houses offer a mix of periods and media. Tuesday's sale at Chiswick Auctions in West London includes a 1968 screenprint of Campbell's Tomato Soup by Andy Warhol, at £6,000 to £8,000, and 44 sketches by Augustus John, at £200 to £800 each. The latter have been restored after the artist tore them up. Meanwhile, the paintings and furniture sale at Duke's of Dorchester on Thursday has a coloured block print of Acrobats at Play by Marc Chagall, at £100 to £200, and a lithograph of a mother and child by Henry Moore, at £500 to £700. A group of five watercolour landscape studies by Jean-Baptiste Camille Corot is up at £1,500 to £3,000.</p>
                    <p>Affordable works from lesser-known artists and younger markets are less safe, but they have the potential to offer greater rewards if you catch an emerging trend. Speculating on such trends is high-risk, so is worthwhile only if you like what you buy (you get something beautiful to keep, whatever happens), can afford to lose the capital and enjoy the necessary research.</p>
                    <p>A trend could be based on a country or region. China has rocketed, but other Asian and Middle Eastern markets have yet to really emerge. Mr Horwich mentions some 1970s Iraqi paintings that he sold this year in Dubai. 'They are part of a sophisticated scene that remains little-known.' Mr Hoffman tips Turkey and the Middle East. Meanwhile, the Sotheby's Impressionist and modern art sale in New York features a 1962 oil by the Vietnamese Vu Cao Dam, a graduate of Hanoi's École des Beaux Arts de l'Indochine and friend of Chagall, at $8,000 to $12,000 (£5,088 to £7,632). The painting shows two girls boating in traditional ao dai dresses.</p>
                    <p>A further way of making money is to try to spot talent in younger artists. The annual Frieze Art Fair in Regent's Park provides a chance to buy from 170 contemporary galleries. Or you could gamble on the future fame trajectory of an established artist's subject. For example, a Gerald Laing screenprint of The Kiss (2007) showing Amy Winehouse and her ex-husband is up for £4,700 at the Multiplied fair.</p>
                </div>
                <div id="passage-text-2" className="reading-passage hidden">
                    <h4 className="text-center">Monkeys and Forests</h4>
                    <p><strong>A</strong>&nbsp;&nbsp;Ken Glander, a primatologist from Duke University, gazes into the canopy, tracking the female's movements. Holding a dart gun, he waits with infinite patience for the right moment to shoot. With great care, Glander aims and fires. Hit in the rump, the monkey wobbles. This howler belongs to a population that has lived for decades at Hacienda La Pacifica, a working cattle ranch in Guanacaste province. Other native primates — white-faced capuchin monkeys and spider monkeys — once were common in this area, too, but vanished after the Pan-American Highway was built nearby in the 1950s. Most of the surrounding land was clear-cut for pasture.</p>
                    <p><strong>B</strong>&nbsp;&nbsp;Howlers persist at La Pacifica, Glander explains, because they are leaf-eaters. They eat fruit, when it's available but, unlike capuchin and spider monkeys, do not depend on large areas of fruiting trees. "Howlers can survive anyplace you have half a dozen trees because their eating habits are so flexible" he says. In forests, life is an arms race between trees and the myriad creatures that feed on leaves. Plants have evolved a variety of chemical defences, ranging from bad-tasting tannins, which bind with plant-produced nutrients, rendering them indigestible, to deadly poisons, such as alkaloids and cyanide.</p>
                    <p><strong>C</strong>&nbsp;&nbsp;All primates, including humans, have some ability to handle plant toxins. "We can detoxify a dangerous poison known as caffeine, which is deadly to a lot of animals:" Glander says. For leaf-eaters, long-term exposure to a specific plant toxin can increase their ability to defuse the poison and absorb the leaf nutrients. The leaves that grow in regenerating forests, like those at La Pacifica, are actually more howler friendly than those produced by the undisturbed, centuries-old trees that survive farther south, in the Amazon Basin. In younger forests, trees put most of their limited energy into growing wood, leaves and fruit, so they produce much lower levels of toxin than do well- established, old-growth trees.</p>
                    <p><strong>D</strong>&nbsp;&nbsp;The value of maturing forests to primates is a subject of study at Santa Rosa National Park, about 35 miles northwest of Hacienda La Pacifica. The park hosts populations not only of mantled howlers but also of white-faced capuchins and spider monkeys. Yet the forests there are young, most of them less than 50 years old. Capuchins were the first to begin using the reborn forests when the trees were as young as 14 years. Howlers, larger and heavier than capuchins, need somewhat older trees, with limbs that can support their greater body weight. A working ranch at Hacienda La Pacifica also explains their population boom in Santa Rosa. "Howlers are more resilient than capuchins and spider monkeys for several reasons, Fedigan explains. "They can live within a small home range, as long as the trees have the right food for them. Spider monkeys, on the other hand, occupy a huge home range, so they can't make it in fragmented habitat"</p>
                    <p><strong>E</strong>&nbsp;&nbsp;Howlers also reproduce faster than do other monkey species in the area. Capuchins don't bear their first young until about 7 years old, and spider monkeys do so even later, but howlers give birth for the first time at about 3.5 years of age. Also, while a female spider monkey will have a baby about once every four years, well-fed howlers can produce an infant every two years.</p>
                    <p><strong>F</strong>&nbsp;&nbsp;The leaves howlers eat hold plenty of water, so the monkeys can survive away from open streams and water holes. This ability gives them a real advantage over capuchin and spider monkeys, which have suffered during the long, ongoing drought in Guanacaste.</p>
                    <p><strong>G</strong>&nbsp;&nbsp;Growing human population pressures in Central and South America have led to the persistent destruction of forests. During the 1990s, about 1.1 million acres of Central American forest were felled yearly. Alejandro Estrada, an ecologist at Estacion de Biologia Los Tuxtlas in Veracruz, Mexico, has been exploring how monkeys survive in a landscape increasingly shaped by humans. He and his colleagues recently studied the ecology of a group of mantled howler monkeys that thrive in a habitat completely altered by humans: a cacao plantation in Tabasco, Mexico. Like many varieties of coffee, cacao plants need shade to grow, so 40 years ago the landowners planted fig, monkey pod and other tall trees to form a protective canopy over their crop. The howlers moved in about 25 years ago after nearby forests were cut. This strange habitat, a hodgepodge of cultivated native and exotic plants, seems to support about as many monkeys as would a same-sized patch of wild forest. The howlers eat the leaves and fruit of the shade trees, leaving the valuable cacao pods alone, so the farmers tolerate them</p>
                    <p><strong>H</strong>&nbsp;&nbsp;Estrada believes the monkeys bring underappreciated benefits to such farms, dispersing the seeds of fig and other shade trees and fertilizing the soil with feces. He points out that howler monkeys live in shade coffee and cacao plantations in Nicaragua and Costa Rica as well as in Mexico. Spider monkeys also forage in such plantations, though they need nearby areas of forest to survive in the long term. He hopes that farmers will begin to see the advantages of associating with wild monkeys, which includes potential ecotourism projects. "Conservation is usually viewed as a conflict between agricultural practices and the need to preserve nature," Estrada says. "We're moving away from that vision and beginning to consider ways in which agricultural activities may become a tool for the conservation of primates in human-modified landscapes."</p>
                </div>
                <div id="passage-text-3" className="reading-passage hidden">
                    <h4 className="text-center">High-tech crime-fighting tools</h4>
                    <p><strong>A</strong>&nbsp;&nbsp;Crime-fighting technology is getting more sophisticated and rightly so. The police need to be equipped for the 21st century. In Britain we've already got the world's biggest DNA database. By next year the state will have access to the genetic data of 4.25m people: one British-based person in 14. Hundreds of thousands of those on the database will never have been charged with a crime.</p>
                    <p><strong>B</strong>&nbsp;&nbsp;Britain is also reported to have more than £4 million CCTV (closed circuit television) cameras. There is a continuing debate about the effectiveness of CCTV. Some evidence suggests that it is helpful in reducing shoplifting and car crime. It has also been used to successfully identify terrorists and murderers. However, many claim that better lighting is just as effective to prevent crime and that cameras could displace crime. An internal police report said that only one crime was solved for every 1,000 cameras in London in 2007. In short, there is conflicting evidence about the effectiveness of cameras, so it is likely that the debate will continue.</p>
                    <p><strong>C</strong>&nbsp;&nbsp;Professor Mike Press, who has spent the past decade studying how design can contribute to crime reduction, said that, in order for CCTV to have any effect, it must be used in a targeted way. For example, a scheme in Manchester records every licence plate at the entrance of a shopping complex and alerts police when one is found to belong to an untaxed or stolen car. This is an effective example of monitoring, he said. Most schemes that simply record city centres continually - often not being watched - do not produce results. CCTV can also have the opposite effect of that intended, by giving citizens a false sense of security and encouraging them to be careless with property and personal safety. Professor Press said: 'All the evidence suggests that CCTV alone makes no positive impact on crime reduction and prevention at all. The weight of evidence would suggest the investment is more or less a waste of money unless you have lots of other things in place. He believes that much of the increase is driven by the marketing efforts of security companies who promote the crime-reducing benefits of their products. He described it as a 'lazy approach to crime prevention' and said that authorities should instead be focusing on how to alter the environment to reduce crime.</p>
                    <p><strong>D</strong>&nbsp;&nbsp;But in reality, this is not what is happening. Instead, police are considering using more technology. Police forces have recently begun experimenting with cameras in their helmets. The footage will be stored on police computers, along with the footage from thousands of CCTV cameras and millions of pictures from numberplate recognition cameras used increasingly to check up on motorists.</p>
                    <p><strong>E</strong>&nbsp;&nbsp;And now another type of technology is being introduced. It's called the Microdrone and it's a toy-sized remote-control craft that hovers above streets or crowds to film what's going on beneath. The Microdrone has already been used to monitor rock festivals, but its supplier has also been in discussions to supply it to the Metropolitan Police, and Soca, the Serious Organised Crime Agency. The drones are small enough to be unnoticed by people on the ground when they are flying at 350ft. They contain high- resolution video surveillance equipment and an infrared night vision capability, so even in darkness they give their operators a bird's-eye view of locations while remaining virtually undetectable.</p>
                    <p><strong>F</strong>&nbsp;&nbsp;The worrying thing is, who will get access to this technology? Merseyside police are already employing two of the devices as part of a pilot scheme to watch football crowds and city parks looking for antisocial behavior. It is not just about crime detection: West Midlands fire brigade is about to lease a drone, for example, to get a better view of fire and flood scenes and aid rescue attempts; the Environment Agency is considering their use for monitoring of illegal fly tipping and oil spills. The company that makes the drone says it has no plans to license the equipment to individuals or private companies, which hopefully will prevent private security firms from getting their hands on them. But what about local authorities? In theory, this technology could be used against motorists. And where will the surveillance society end? Already there are plans to introduce 'smart water' containing a unique DNA code identifier that when sprayed on a suspect will cling to their clothes and skin and allow officers to identify them later. As long as high-tech tools are being used in the fight against crime and terrorism, fine. But if it's another weapon to be used to invade our privacy then we don't want it.</p>
                </div>
            </div>
            <div className="resizer" id="resizer"></div>
            <div className="questions-panel" id="questions-panel">
                <div id="questions-1" className="question-set">
                    <div className="questions-container">
                        <div className="question" data-q-start="1" data-q-end="5">
                            <div className="question-prompt">
                                <p><strong>Questions 1-5</strong><br/>Use information from the passage to complete the table below.</p>
                                <p>Use <strong>NO MORE THAN TWO WORDS</strong> from the passage for each space.</p>
                            </div>
                            <table className="people-table">
                                <thead><tr><th>Type of Art</th><th>Artist(s)</th><th>Price Range</th></tr></thead>
                                <tbody>
                                    <tr><td>Ceramics and lithographs</td><td>Picasso</td><td><input type="text" className="answer-input" id="q1" placeholder="1"/></td></tr>
                                    <tr><td>Screenprints or lithographs</td><td>Picasso, Matisse, Miró, Steinlen</td><td><input type="text" className="answer-input" id="q2" placeholder="2"/></td></tr>
                                    <tr><td>Oils</td><td>Anthony Gross</td><td><input type="text" className="answer-input" id="q3" placeholder="3"/></td></tr>
                                    <tr><td>Oils</td><td>Mary Fedden</td><td><input type="text" className="answer-input" id="q4" placeholder="4"/></td></tr>
                                    <tr><td>Screenprint</td><td>Andy Warhol</td><td><input type="text" className="answer-input" id="q5" placeholder="5"/></td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="question" data-q-start="6" data-q-end="9">
                            <div className="question-prompt">
                                <p><strong>Questions 6-9</strong><br/>Choose one of the endings (i-viii) from the List of Endings to complete each sentence below.</p>
                            </div>
                            <div className="example-box">
                                <p><strong>List of Endings</strong></p>
                                <ul style={{listStyleType: 'lower-roman', marginLeft: '20px'}}>
                                    <li>i artists that have never been popular at all.</li>
                                    <li>ii hand-made and personal art works.</li>
                                    <li>iii items that are not really popular with buyers but good value for money.</li>
                                    <li>iv artists that seem to like real life topics.</li>
                                    <li>v top artists that sell many works.</li>
                                    <li>vi artists who have used a particular type of material.</li>
                                    <li>vii relatively cheap limited editions prints.</li>
                                    <li>viii artists whose work is not often seen by the wider public</li>
                                </ul>
                            </div>
                            <div className="matching-form-container">
                                {['6', '7', '8', '9'].map(qNum => (
                                    <div className="matching-form-row" key={qNum}>
                                        <label htmlFor={`q${qNum}`} className="matching-form-label">
                                            <strong>{qNum}</strong>&nbsp;&nbsp;{qNum === '6' ? "'Multiples' are" : qNum === '7' ? "Prints are" : qNum === '8' ? "Gross and Fedden are" : "Victorian painters are"}
                                        </label>
                                        <select className="answer-input" id={`q${qNum}`}><option value=""></option><option value="i">i</option><option value="ii">ii</option><option value="iii">iii</option><option value="iv">iv</option><option value="v">v</option><option value="vi">vi</option><option value="vii">vii</option><option value="viii">viii</option></select>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="question" data-q-start="10" data-q-end="13">
                            <div className="question-prompt"><p><strong>Questions 10-13</strong><br/>Do the following statements agree with the information given in Reading Passage 1?</p></div>
                            {[
                                {n: 10, t: "Picasso, Warhol, Matisse, Miró and Steinlen are big-name artists."},
                                {n: 11, t: "It is possible to buy a painting by Picasso for less than £5,000."},
                                {n: 12, t: "Greeting cards can sell for up to £10,000 each."},
                                {n: 13, t: "It is not worth investing in new artists or markets because there is a great risk of losing all your money."}
                            ].map(q => (
                                <div className="tf-question" key={q.n} data-q-start={q.n}>
                                    <div className="tf-question-line"><span className="tf-question-number">{q.n}</span><span className="tf-question-text">{q.t}</span></div>
                                    <div className="tf-options">
                                        {["TRUE", "FALSE", "NOT GIVEN"].map(opt => (
                                            <label className="tf-option" key={opt}><input type="radio" name={`q${q.n}`} value={opt}/> {opt}</label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Questions 2 & 3 would go here similarly - truncated for brevity in this tool call but included in final code */}
                <div id="questions-2" className="question-set hidden">
                     {/* Questions 14-27 implementation */}
                     <div className="question" data-q-start="14" data-q-end="19">
                        <div className="question-prompt"><p><strong>Questions 14-19</strong><br/>Which section contains the following information?</p></div>
                        {['14', '15', '16', '17', '18', '19'].map(q => (
                             <div className="matching-form-row" key={q}>
                                <label htmlFor={`q${q}`} className="matching-form-label"><strong>{q}</strong>&nbsp;&nbsp;{
                                    q === '14' ? "a reference of reduction in Forest inhabitant." :
                                    q === '15' ? "Only one species of monkey survived while other two species have vanished." :
                                    q === '16' ? "a reason for howler Monkey of choosing new leaves." :
                                    q === '17' ? "mention to Howler Monkey's nutrient and eating habits." :
                                    q === '18' ? "a reference of asking farmers' changing attitude toward wildlife." :
                                    "the advantage for Howler Monkey's flexibility living in a segmented habitat."
                                }</label>
                                <select className="answer-input" id={`q${q}`}><option value=""></option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option><option value="F">F</option><option value="G">G</option><option value="H">H</option></select>
                             </div>
                        ))}
                     </div>
                     <div className="question" data-q-start="20" data-q-end="22">
                        <div className="question-prompt"><p><strong>Questions 20-22</strong><br/>Match each description with the correct place, A-E.</p></div>
                        {['20', '21', '22'].map(q => (
                             <div className="matching-form-row" key={q}>
                                <label htmlFor={`q${q}`} className="matching-form-label"><strong>{q}</strong>&nbsp;&nbsp;{
                                    q === '20' ? "Howler Monkey's benefit to the local region's agriculture" :
                                    q === '21' ? "Original home for all three native monkeys" :
                                    "A place where Capuchins monkey comes for a better habitat"
                                }</label>
                                <select className="answer-input" id={`q${q}`}><option value=""></option><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option><option value="E">E</option></select>
                             </div>
                        ))}
                     </div>
                     <div className="question" data-q-start="23" data-q-end="27">
                        <p><strong>23</strong>&nbsp;&nbsp;Leaf when <input type="text" className="answer-input" id="q23" placeholder="23"/> is not easily found.</p>
                        <p><strong>24</strong>&nbsp;&nbsp;Alleviate the <input type="text" className="answer-input" id="q24" placeholder="24"/> which old and young trees used to protect themselves.</p>
                        <p><strong>25</strong>&nbsp;&nbsp;The <input type="text" className="answer-input" id="q25" placeholder="25"/> rate of Howlers is relatively faster.</p>
                        <p><strong>26</strong>&nbsp;&nbsp;Hold the high content of <input type="text" className="answer-input" id="q26" placeholder="26"/> which ensure them to resist to continuous</p>
                        <p><strong>27</strong>&nbsp;&nbsp;<input type="text" className="answer-input" id="q27" placeholder="27"/> in Guanacaste.</p>
                     </div>
                </div>
                <div id="questions-3" className="question-set hidden">
                    <div className="question" data-q-start="28" data-q-end="32">
                         {['28', '29', '30', '31' , '32'].map(q => (
                             <div className="matching-form-row" key={q}>
                                <label htmlFor={`q${q}`} className="matching-form-label"><strong>{q}</strong>&nbsp;&nbsp;Paragraph {String.fromCharCode(66 + parseInt(q) - 28)}</label>
                                <select className="answer-input" id={`q${q}`}><option value=""></option><option value="i">i</option><option value="ii">ii</option><option value="iii">iii</option><option value="iv">iv</option><option value="v">v</option><option value="vi">vi</option><option value="vii">vii</option><option value="viii">viii</option><option value="ix">ix</option></select>
                             </div>
                         ))}
                    </div>
                    <div className="question" data-q-start="33" data-q-end="35">
                        {/* Multiple Choice 33-35 */}
                        {[
                            {n: 33, t: "Britain has already got", opts: ["A four million CCTV cameras.", "B more data about DNA than any other country.", "C the most sophisticated crime-fighting technology.", "D access to the genetic data of one in fourteen people living in Britain."]},
                            {n: 34, t: "Professor Press", opts: ["A works at the University of Manchester.", "B studies car-related crime.", "C is concerned about the negative impact of the use of CCTV.", "D feels that some marketing departments lie about the crime-reducing benefits of CCTV."]},
                            {n: 35, t: "The Microdrone is", opts: ["A a type of toy in the shape of a plane.", "B being used by the Metropolitan Police.", "C being used by the government.", "D able to film in the dark."]}
                        ].map(q => (
                            <div className="multi-choice-question" key={q.n}>
                                <p><strong>{q.n}</strong>&nbsp;&nbsp;{q.t}</p>
                                {q.opts.map(opt => (
                                    <div className="multi-choice-option" key={opt}><label><input type="radio" name={`q${q.n}`} value={opt.charAt(0)}/> {opt}</label></div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="question" data-q-start="36" data-q-end="37">
                        <p><strong>36</strong>&nbsp;&nbsp;Give examples of 2 events where technology is used to watch crowds. <input type="text" className="answer-input" id="q36" placeholder="36"/></p>
                        <p><strong>37</strong>&nbsp;&nbsp;According to the passage, who do we not want to use the Microdrone? <input type="text" className="answer-input" id="q37" placeholder="37"/></p>
                    </div>
                    <div className="question" data-q-start="38" data-q-end="40">
                         {[
                             {n: 38, t: "The British authorities use too much technology to monitor their citizens."},
                             {n: 39, t: "Microdrone is currently not used to check drivers."},
                             {n: 40, t: "Technology should not be used to check on people's private affairs."}
                         ].map(q => (
                             <div className="tf-question" key={q.n}>
                                <div className="tf-question-line"><span className="tf-question-number">{q.n}</span><span className="tf-question-text">{q.t}</span></div>
                                <div className="tf-options">
                                    {["YES", "NO", "NOT GIVEN"].map(opt => (
                                        <label className="tf-option" key={opt}><input type="radio" name={`q${q.n}`} value={opt}/> {opt}</label>
                                    ))}
                                </div>
                             </div>
                         ))}
                    </div>
                </div>
            </div>
        </div>
      </div>

      <nav className="nav-row">
          {[1, 2, 3].map(part => (
              <div key={part} id={`wrapper-${part}`} className={`footer__questionWrapper___1tZ46 ${part === 1 ? 'selected' : ''}`}>
                  <button className="footer__questionNo___3WNct">Part {part}</button>
                  <div className="footer__subquestionWrapper___9GgoP">
                      {Array.from({length: part === 3 ? 13 : (part === 2 ? 14 : 13)}).map((_, i) => {
                          const qNum = (part === 1 ? 0 : (part === 2 ? 13 : 27)) + i + 1;
                          return <button key={qNum} className="subQuestion">{qNum}</button>
                      })}
                  </div>
              </div>
          ))}
          <button id="deliver-button" className="footer__deliverButton___3FM07">Check Answers</button>
      </nav>

      <div id="results-modal" className="modal-overlay hidden">
          <div className="modal-content">
              <button className="modal-close-btn" onClick={() => document.getElementById('results-modal')?.classList.add('hidden')}>&times;</button>
              <h2>Results</h2>
              <div className="results-summary">
                  <p>Score: {score} / 40</p>
              </div>
          </div>
      </div>

      {/* Navigation Arrows */}
      <div className="nav-arrows">
          <button className="nav-arrow">‹</button>
          <button className="nav-arrow">›</button>
      </div>
    </div>
  );
}
