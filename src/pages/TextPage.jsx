/* global SetValue, Commit */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pagesStyle/TextPage.css';

const TextPage = () => {
  const navigate = useNavigate();

  // טקסט ארוך מחולק לעמודים
  const pages = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper.`,
    `Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;`,
    `Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit. Phasellus fermentum in, dolor. Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris nec malesuada fames ac turpis velit, rhoncus eu, luctus et interdum adipiscing wisi.`
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [displayedText, setDisplayedText] = useState('');

  // אנימציית "כתיבת טקסט"
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const text = pages[currentPage];
    const interval = setInterval(() => {
      setDisplayedText(prev => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage + 1 < pages.length) {
      setCurrentPage(currentPage + 1);
    } else {
      // סיום הטקסט
      sessionStorage.setItem("textDone", "true");

      if (typeof SetValue === "function") {
        SetValue("cmi.suspend_data", "text_done=true");
        Commit();
      }

      if (typeof window.checkIfAllDone === "function") {
        window.checkIfAllDone();
      }

      // מעבר אוטומטי לעמוד הבית
      navigate('/');
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="page text-page">
      <h2>עמוד מידע</h2>
      <div className="text-container">
        <p>{displayedText}</p>
      </div>

      <div className="navigation-buttons">
        <button
          className="nav-btn"
          onClick={handlePrev}
          disabled={currentPage === 0}
        >
          ➡️ קודם
        </button>
        <button
          className="nav-btn"
          onClick={handleNext}
        >
          {currentPage === pages.length - 1 ? 'סיום' : 'הבא⬅️'}
        </button>
      </div>

      <button className="home-btn" onClick={() => navigate('/')}>
        חזור לבית
      </button>
    </div>
  );
};

export default TextPage;
