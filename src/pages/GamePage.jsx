/* global SetValue, Commit */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pagesStyle/GamePage.css';

const GamePage = () => {
    const [step, setStep] = useState(0);
    const navigate = useNavigate();

    const handleNext = () => setStep(prev => prev + 1);

    const Step1 = () => {
        const [dropped, setDropped] = useState(false);
        const [position, setPosition] = useState({ x: 250, y: 190 }); // מיקום התחלתי בתוך הקונטיינר
        const [touchOffset, setTouchOffset] = useState({ x: 0, y: 0 });
        const containerRef = React.useRef(null);
        const dropZoneRef = React.useRef(null);

        // --- מחשב (drag/drop רגיל)
        const handleDrop = (e) => {
            e.preventDefault();
            setDropped(true);
        };

        // --- מובייל (touch)
        const handleTouchStart = (e) => {
            const touch = e.touches[0];
            const containerRect = containerRef.current.getBoundingClientRect();
            setTouchOffset({
                x: touch.clientX - containerRect.left - position.x,
                y: touch.clientY - containerRect.top - position.y,
            });
        };

        const handleTouchMove = (e) => {
            const touch = e.touches[0];
            const containerRect = containerRef.current.getBoundingClientRect();
            setPosition({
                x: touch.clientX - containerRect.left - touchOffset.x,
                y: touch.clientY - containerRect.top - touchOffset.y,
            });
        };

        const handleTouchEnd = () => {
            const dropZone = dropZoneRef.current;
            const containerRect = containerRef.current.getBoundingClientRect();
            if (dropZone) {
                const dzRect = dropZone.getBoundingClientRect();
                const centerX = position.x + 25 + containerRect.left;
                const centerY = position.y + 25 + containerRect.top;
                if (
                    centerX > dzRect.left &&
                    centerX < dzRect.right &&
                    centerY > dzRect.top &&
                    centerY < dzRect.bottom
                ) {
                    setDropped(true);
                }
            }
        };

        return (
            <div className='GamePage'>
                <div className="task-container" ref={containerRef} style={{ position: 'relative' }}>
                    <h3>משימה 1: גרור את העיגול</h3>
                    <p>גרור את העיגול הצהוב אל העיגול הגדול 🎯</p>
                    <div
                        className="drop-zone"
                        ref={dropZoneRef}
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        {dropped && <div className="circle success"></div>}
                    </div>
                    {!dropped && (
                        <div
                            className="circle draggable"
                            draggable
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            style={{
                                position: 'absolute',
                                left: position.x,
                                top: position.y,
                            }}
                        ></div>
                    )}
                    {dropped && <button className="nav-btn" onClick={handleNext}>הבא⬅️</button>}
                </div>

            </div>

        );
    };

    // --- שלב 2: לחץ 5 פעמים עם אנימציה וספירה ---
    const Step2 = () => {
        const [count, setCount] = useState(0);
        const [celebrate, setCelebrate] = useState(false);

        const handleClick = () => {
            const newCount = count + 1;
            setCount(newCount);
            if (newCount === 5) {
                setCelebrate(true);
            }
        };

        return (
            <div className='GamePage'>

                <div className="task-container">
                    <h3>משימה 2: לחץ 5 פעמים</h3>
                    <p>לחץ על הכפתור 5 פעמים!</p>

                    <button
                        className={`task-btn-circle ${celebrate ? 'celebrate-btn' : ''}`}
                        onClick={handleClick}
                    />

                    {/* ספירה ויזואלית */}
                    <div className="click-counter">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`dot ${i < count ? 'active' : ''}`}></span>
                        ))}
                    </div>

                    {celebrate && (
                        <div className="celebration-animation">
                            🎉 כל הכבוד! סיימת את המשימה! 🎉
                        </div>
                    )}

                    <div className="navigation-buttons">
                        <button className="nav-btn" onClick={() => setStep(step - 1)} disabled={step === 0}>
                            ➡️ קודם
                        </button>
                        {celebrate && <button className="nav-btn" onClick={handleNext}>הבא⬅️</button>}
                    </div>
                </div>
            </div>

        );
    };

    // --- שלב 3: בחר צבע ---
    const Step3 = () => {
        const correctColor = 'green';
        const [selected, setSelected] = useState(null);

        return (
            <div className='GamePage'>

                <div className="task-container">
                    <h3>משימה 3: בחר צבע</h3>
                    <p>בחר את הצבע הירוק ✅</p>
                    <div className="color-options">
                        {['red', 'blue', 'green', 'yellow'].map(color => (
                            <div
                                key={color}
                                className={`color-circle ${color} ${selected === color ? 'selected' : ''}`}
                                onClick={() => setSelected(color)}
                            />
                        ))}
                    </div>
                    {selected === correctColor && <button className="nav-btn" onClick={handleNext}>הבא⬅️</button>}
                </div>
            </div>

        );
    };

    // --- שלב 4: גרור פירות למקום הנכון עם צבעים ---
    const Step4 = () => {
        const items = [
            { emoji: '🍎', color: '#e74c3c' },
            { emoji: '🍌', color: '#f1c40f' },
            { emoji: '🍇', color: '#8e44ad' }
        ];

        const [placed, setPlaced] = useState([false, false, false]);
        const [draggingIndex, setDraggingIndex] = useState(null);
        const [positions, setPositions] = useState(items.map((_, i) => ({ x: 55 + i * 80, y: 390 })));
        const [touchOffset, setTouchOffset] = useState({ x: 0, y: 0 });
        const containerRef = React.useRef(null);
        const dropRefs = React.useRef([]);

        // --- מחשב
        const handleDragStart = (index) => setDraggingIndex(index);
        const handleDrop = (i) => {
            if (draggingIndex === i) {
                const newPlaced = [...placed];
                newPlaced[i] = true;
                setPlaced(newPlaced);
            }
            setDraggingIndex(null);
        };

        // --- מובייל
        const handleTouchStart = (e, index) => {
            const touch = e.touches[0];
            const containerRect = containerRef.current.getBoundingClientRect();
            setDraggingIndex(index);
            setTouchOffset({
                x: touch.clientX - containerRect.left - positions[index].x,
                y: touch.clientY - containerRect.top - positions[index].y,
            });
        };

        const handleTouchMove = (e) => {
            if (draggingIndex === null) return;
            const touch = e.touches[0];
            const containerRect = containerRef.current.getBoundingClientRect();
            const newPositions = [...positions];
            newPositions[draggingIndex] = {
                x: touch.clientX - containerRect.left - touchOffset.x,
                y: touch.clientY - containerRect.top - touchOffset.y,
            };
            setPositions(newPositions);
        };

        const handleTouchEnd = () => {
            if (draggingIndex === null) return;
            const dropZone = dropRefs.current[draggingIndex];
            const containerRect = containerRef.current.getBoundingClientRect();
            if (dropZone) {
                const dzRect = dropZone.getBoundingClientRect();
                const centerX = positions[draggingIndex].x + 25 + containerRect.left;
                const centerY = positions[draggingIndex].y + 25 + containerRect.top;
                if (
                    centerX > dzRect.left &&
                    centerX < dzRect.right &&
                    centerY > dzRect.top &&
                    centerY < dzRect.bottom
                ) {
                    const newPlaced = [...placed];
                    newPlaced[draggingIndex] = true;
                    setPlaced(newPlaced);
                }
            }
            setDraggingIndex(null);
        };

        return (
            <div className='GamePage'>

                <div className="task-container" ref={containerRef} style={{ position: 'relative' }}>
                    <h3>משימה 4: גרור פירות למקום הנכון</h3>
                    <p>גרור את הפירות אל העיגול בצבע המתאים 🍎🍌🍇</p>

                    <div className="drop-row">
                        {items.map((item, i) => (
                            <div
                                key={i}
                                className="drop-zone small"
                                ref={(el) => (dropRefs.current[i] = el)}
                                style={{ borderColor: item.color }}
                                onDrop={() => handleDrop(i)}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                {placed[i] ? item.emoji : null}
                            </div>
                        ))}
                    </div>

                    <div className="drag-row">
                        {items.map((item, i) => !placed[i] && (
                            <div
                                key={i}
                                className="draggable-item"
                                draggable
                                onDragStart={() => handleDragStart(i)}
                                onTouchStart={(e) => handleTouchStart(e, i)}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                style={{
                                    backgroundColor: item.color,
                                    position: 'absolute',
                                    left: positions[i].x,
                                    top: positions[i].y,
                                }}
                            >
                                {item.emoji}
                            </div>
                        ))}
                    </div>

                    {placed.every(Boolean) && <button className="nav-btn" onClick={handleNext}>הבא⬅️</button>}
                </div>
            </div>

        );
    };


    // --- שלב 5: תופסת את הכדור עם אנימציה מתוחכמת ---
    const Step5 = () => {
        const [caught, setCaught] = useState(false);
        const [position, setPosition] = useState({ x: 0, y: 0 });

        const handleClick = () => {
            setPosition({ x: Math.random() * 200 - 100, y: Math.random() * 100 - 50 });
            setCaught(true);
        };

        return (
            <div className='GamePage'>

                <div className="task-container">
                    <h3>משימה 5: תפוס את הכדור</h3>
                    <p>לחץ על הכדור ותפס אותו! ⚽ הכדור יזוז לכל מקום! 🎯</p>
                    <div
                        className="moving-ball"
                        style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                        onClick={handleClick}
                    ></div>
                    {caught && <button className="nav-btn" onClick={handleNext}>הבא⬅️</button>}
                </div>
            </div>

        );
    };

    // --- שלב 6: סיום ---
    const Step6 = () => {
        // דיווח ל‑SCORM על סיום המשחק
        if (typeof SetValue === "function") {
            SetValue("cmi.suspend_data", "game_done=true");
            Commit();
        }

        sessionStorage.setItem("gameDone", "true");

        if (typeof window.checkIfAllDone === "function") {
            window.checkIfAllDone();
        }

        return (
            <div className="task-container">
                <h3>משימה 6: סיום</h3>
                <p>🎉 כל הכבוד! סיימת את המשחק! 🎉</p>
                <button className="home-btn" onClick={() => navigate('/')}>
                    חזור לבית
                </button>
            </div>
        );
    };

    const steps = [<Step1 />, <Step2 />, <Step3 />, <Step4 />, <Step5 />, <Step6 />];

    return (
        <div className="page game-page">
            <h2>משחק שלבים אינטראקטיבי</h2>
            <div className="game-container">{steps[step]}</div>
        </div>
    );
};


export default GamePage;
