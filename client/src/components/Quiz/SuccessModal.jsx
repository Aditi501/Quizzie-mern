import React, { useState } from 'react';
import styles from './SuccessModal.module.css';
import accept from '../../assets/accept.png';
const SuccessModal = ({ isOpenModal, link, onCloseModal }) => {
  const [isCopied, setIsCopied] = useState(false);
  console.log('SuccessModal rendered');
  const handleShare = () => {
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000); 
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.Published}>Congrats your Quiz is Published!</h2>
        {isCopied && <p className={styles.copiedMessage}><img src={accept}/> Link copied to clipboard </p>}
        <button onClick={onCloseModal} className={styles.cross}>×</button>
        <input type="text" value={link} className={styles.ShareLink} readOnly />
        <button onClick={handleShare} className={styles.share}>Share</button>
      </div>
    </div>

  );
};

export default SuccessModal;
