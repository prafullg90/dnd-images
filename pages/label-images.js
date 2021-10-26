import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import uid from '../util/idhelper';
import { jsonFile } from '../util/jsondownloader';
import styles from '../styles/Label.module.css';

const Label = () => {
  const [newTags, setNewtags] = useState([]);
  const [imgesTags, setImageTags] = useState([]);
  const [tagVal, setTagVal] = useState('');
  const [images, setImages] = useState([]);
  const [activeImg, setActiveImg] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [imgDetails, setImgDetails] = useState({});
  const router = useRouter();

  useEffect(() => {
    const myImageData = localStorage.getItem('droppedImages');
    const myImageDetails = localStorage.getItem('imgData');
    const arrofImage = JSON.parse(myImageData);
    const arrofDetails = JSON.parse(myImageDetails);
    const newImageArr = arrofImage.map((item) => {
      const imgObj = {
        id: uid(),
        imgData: item,
      };
      return imgObj;
    });
    setImages(newImageArr);
    setImgDetails(arrofDetails);
  }, []);

  useEffect(() => {
    setActiveImg(images[currentPage]);
  }, [currentPage, images]);

  const setTagsFunc = (e) => {
    let lastChar = e.target.value.substr(e.target.value.length - 1);
    if (lastChar == ' ') {
      if (e.target.value !== ' ') {
        const tagObj = {
          id: uid(),
          val: e.target.value,
        };
        setNewtags((prev) => [...prev, tagObj]);
        setTagVal('');
      }
    } else {
      setTagVal(e.target.value);
    }
  };

  const idTagsToImage = (id) => {
    const clickedObj = newTags.filter((item) => item.id === id);
    const removeObj = newTags.filter((item) => item.id !== id);
    clickedObj[0].imgId = activeImg.id;
    setImageTags((prev) => [...prev, ...clickedObj]);
    setNewtags(removeObj);
  };

  const idTagsRemovefromImage = (id) => {
    const removeObj = imgesTags.filter((item) => item.id !== id);
    setImageTags(removeObj);
  };

  const renderTags = newTags.map((item) => (
    <button
      className={styles.tags}
      index={item.id}
      onClick={() => idTagsToImage(item.id)}
    >
      {item.val} &#9733;
    </button>
  ));

  const renderTagsforImages = imgesTags
    .filter((item) => item.imgId == activeImg.id)
    .map((item) => (
      <button
        className={styles.tags}
        index={item.id}
        onClick={() => idTagsRemovefromImage(item.id)}
      >
        {item.val} &#10006;
      </button>
    ));

  const renderImage = () => {
    return (
      <img
        src={activeImg?.imgData}
        className={styles.imageSlide}
        alt='Folder Image'
      />
    );
  };

  const prevImgClick = () => {
    const totalImages = images.length;
    if (currentPage == 0) {
      setCurrentPage(totalImages - 1);
    } else {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextImgClick = () => {
    const totalImages = images.length - 1;
    if (currentPage == totalImages) {
      setCurrentPage(0);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const submitFiles = () => {
    const mainImgObject = images.map((item) => {
      const imgId = item.id;
      const getTags = imgesTags.filter((tags) => tags.imgId === imgId);
      return {
        ...item,
        imgTags: getTags,
        ...imgDetails,
      };
    });
    jsonFile(mainImgObject, 'exportedImage');
    router.push('/create-project');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Label Images</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <h1 className={styles.title}>Label Images</h1>
      <main className={styles.main}>
        <div className={styles.grid}>
          <div>
            <h3 className={styles.cardTitle}>Images</h3>
            <div className={styles.imagesDiv}>
              <div className={styles.grid}>
                <div className={styles.mainImage}>{renderImage()}</div>
                <div>
                  <div className={styles.dropTag}>{renderTagsforImages}</div>
                  <div>
                    <button
                      className={styles.prevNext}
                      onClick={() => prevImgClick()}
                    >
                      &#60; prev
                    </button>
                    <button
                      className={styles.prevNext}
                      onClick={() => nextImgClick()}
                    >
                      next &#62;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className={styles.cardTitle}>Tags</h3>
            <div className={styles.TagsDiv}>
              <div className={styles.tagsCollection}>{renderTags}</div>
              <input
                type='text'
                id='name'
                name='name'
                className={styles.inputText}
                onChange={(e) => setTagsFunc(e)}
                value={tagVal}
                placeholder='Type Something...'
              />
            </div>
          </div>
        </div>
        <button className={styles.button} onClick={() => submitFiles()}>
          Save
        </button>
      </main>
    </div>
  );
};

export default Label;
