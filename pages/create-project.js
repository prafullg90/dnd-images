import React, { useCallback, useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { useDropzone } from 'react-dropzone';
import { getBase64 } from '../util/imageStore.js';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [droppedImages, setDroppedImages] = useState([]);
  const [storeImgArr, setArr] = useState([]);
  const [imgName, setImgName] = useState('');
  const [imgDescr, setImgDescr] = useState('');
  const [isError, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem('droppedImages');
    localStorage.removeItem('imgData');
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const imgArr = [];
    const imgStore = [];
    console.log(acceptedFiles);
    acceptedFiles.forEach((file) => {
      imgArr.push(file.name);
      getBase64(file).then((result) => {
        imgStore.push(result);
      });
    });

    setArr(imgStore);
    setDroppedImages(imgArr);
  }, []);

  const submitFiles = useCallback(() => {
    setError('');
    if (!imgName || !imgDescr) {
      setError('Please add Image Name and description...!');
      return;
    }

    if (droppedImages.length <= 0) {
      setError('Please drop at least one image in dropbox...!');
      return;
    }
    const imgData = {
      imgName: imgName,
      imgDescr: imgDescr,
    };
    localStorage.setItem('droppedImages', JSON.stringify(storeImgArr));
    localStorage.setItem('imgData', JSON.stringify(imgData));
    router.push('/label-images');
  });

  const renderDroppedImages = droppedImages.map((item) => <p>{item}</p>);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Project</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <h1 className={styles.title}>Create Project</h1>
      <main className={styles.main}>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <img
                src='/folder_folder.png'
                className={styles.folder_image}
                alt='Folder Image'
              />
              <div className={styles.formText}>
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>drag &amp; drop images here</p>
                )}
              </div>
              {renderDroppedImages}
            </div>
          </div>

          <div className={styles.form}>
            <div className={styles.formText}>Name</div>
            <input
              type='text'
              id='name'
              name='name'
              className={styles.inputText}
              onChange={(e) => setImgName(e.target.value)}
              value={imgName}
              placeholder='Type Something...'
            />

            <div className={styles.formText}>Description</div>
            <textarea
              id='desc'
              name='desc'
              className={styles.inputTextArea}
              placeholder='Type Something...'
              onChange={(e) => setImgDescr(e.target.value)}
              value={imgDescr}
            />
          </div>
        </div>
        <div className={styles.isError}>{isError && isError}</div>
        <button className={styles.button} onClick={() => submitFiles()}>
          Create
        </button>
      </main>
    </div>
  );
}
