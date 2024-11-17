// 在组件文件顶部添加 "use client"
"use client";
import styles from "./RotatePDF.module.css";
import Image from "next/image";
import {useState} from "react";
import Head from 'next/head';
import PDFViewer from "./pages/component/PDFViewer/index";



export default function RotatePDF() {
  const [displayNav, setDisplayNav] = useState<boolean>(false);
    const [displayStatus, setDisplayStatus] = useState<number>(0); // 0 = draggable, 1 = loading, 2 = normal
    const [file, setFile] = useState<any>(null);
    const [fileName, setFileName] = useState<string>('');

    const footerListData = [
        {
            title: 'Products',
            lists: ['Use cases', 'Chrome extension', 'API docs', 'Pricing', 'Video tutorials', 'Resources', 'Blog', 'FAQ'],
        },
        {
            title: 'We also built',
            lists: ['Resume AI Scanner', 'Invoice AI Scanner', 'AI Quiz Generator', 'QuickyAI', 'Docsium', 'PDF GPTs', 'PDF AI generator', 'Other PDF tools'],
        },
        {
            title: 'Company',
            lists: ['PDF.ai vs ChatPDF', 'PDF.ai vs Acrobat Reader', 'Legal', 'Affiliate program', 'Investor'],
        },
    ];
    // Handle file removal
    const handleRemove = () => {
        setFile(null);
        setDisplayStatus(0);
    };

    // Handle file selection from file input
    const selectFile = (e:any) => {
        const pdfType = ['application/pdf', 'application/acrobat', 'application/x-pdf', 'image/pdf'];
        const selectedFile = e.target.files[0];

        if (pdfType.includes(selectedFile.type)) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setDisplayStatus(1);
            setTimeout(() => {
                setDisplayStatus(2);
            }, 3000);
        } else {
            alert('Please select a valid PDF file');
        }
    };

    // Prevent default drag over behavior
    const handleOnDragOver = (e:any) => {
        e.stopPropagation();
        e.preventDefault();
    };

    // Handle file drop
    const handleOnDrop = (e:any) => {
        e.stopPropagation();
        e.preventDefault();
        const pdfType = ['application/pdf', 'application/acrobat', 'application/x-pdf', 'image/pdf'];
        const droppedFile = e.dataTransfer.files[0];

        if (pdfType.includes(droppedFile.type)) {
            setFile(droppedFile);
            setDisplayStatus(1);
            setTimeout(() => {
                setDisplayStatus(2);
            }, 3000);
        } else {
            alert('Please select a valid PDF file');
        }
    };


    return(
      <>
          <Head>
              <title>Free PDF Page Rotator - Rotate Individual or All Pages</title>
              <meta name="description" content={'Rotate individual or all pages in your PDF effortlessly. No downloads or sign-ups. Fast, secure, and user-friendly. Try now!'} />
              <meta name="keywords" content="rotate pdf, pdf editor, pdf tool, document editor, pdf upload" />
              <meta name="author" content="PDF.ai" />
              <meta property="og:title" content={'Free PDF Page Rotator - Rotate Individual or All Pages'} />
              <meta property="og:description" content={'Rotate individual or all pages in your PDF effortlessly. No downloads or sign-ups. Fast, secure, and user-friendly. Try now!'} />
              <meta property="og:image" content="/path-to-your-image.jpg" />
              <meta property="og:type" content="website" />
              <meta property="og:url" content="https://your-site-url.com/rotate-pdf" />
              <link rel="icon" href="/favicon.ico" />
          </Head>

          <header className={styles.header}>
          <div className={styles.logo_box}>
            <Image
                className={styles.logo_icon}
                src="/Icon-Light-leaves.svg"
                alt="PDF.ai Logo"
                width={100}
                height={30}
                priority
            />
            PDF.ai
          </div>
            <nav className={styles.navi_small_box}>
                <nav onClick={() => setDisplayNav(!displayNav)}>
                    <Image
                        className={styles.logo_icon}
                        src={displayNav ?'/close.svg':"/menu.svg"}
                        alt="Menu Icon"
                        width={30}
                        height={30}
                        priority
                    />
                </nav>
                {displayNav && (
                    <ul className={styles.navigation_small}>
                        <li><a href="#">Pricing</a></li>
                        <li><a href="#">Chrome extension</a></li>
                        <li><a href="#">Use cases</a></li>
                        <li><a href="#">Get started →</a></li>
                    </ul>
                )}
            </nav>
            <nav className={styles.navi_big_box}>
                <ul className={styles.navigation}>
                    <li><a href="#">Pricing</a></li>
                    <li><a href="#">Chrome extension</a></li>
                    <li><a href="#">Use cases</a></li>
                    <li><a href="#">Get started →</a></li>
                </ul>
            </nav>
          {/*{Navigation}*/}
        </header>
          <main className={styles.main_content}>
              <h1 className={styles.main_title}>Rotate PDF Pages</h1>
              <p className={styles.tips}>Simply click on a page to rotate it. You can then download your modified PDF.</p>

              {displayStatus === 0 && (
                  <div
                      id="drop"
                      className={styles.upload_box}
                      onClick={() => document?.querySelector('#file-btn')?.click()}
                      onDragOver={handleOnDragOver}
                      onDrop={handleOnDrop}
                  >
                      <input
                          type="file"
                          id="file-btn"
                          onChange={selectFile}
                          accept=".pdf"
                          style={{ display: 'none' }}
                      />
                      <Image src='/cloudUpload.svg' className={styles.upload_icon} alt="Upload Icon" width={60} height={60} />
                      <div className={styles.upload_tip}>Click to upload or drag and drop</div>
                  </div>
              )}

              {displayStatus === 1 && (
                  <div className={styles.loading_box}>
                      <Image src={'loading.svg'} className={styles.rotating_image} alt="Loading Icon" width={50} height={50} />
                  </div>
              )}

              {displayStatus === 2 && <PDFViewer pdfFile={file} fileName={fileName} handleRemove={handleRemove} />}
          </main>
          <footer className={styles.footer_box}>
              <div className={styles.function_box}>
                  <div>
                      <div className={styles.logo_circle}>
                          <Image src={'/leaves_white.svg'} className={styles.whiteLogo_icon} alt="White Logo" width={40} height={40} />
                      </div>
                      <div className={styles.bottom_text}>Chat with any PDF: ask questions, get summaries, find information, and more.</div>
                      <ul className={styles.logo_list}>
                          <li><a href="#"><Image src={'/tiktok.svg'} className={styles.list_icon} alt="TikTok" width={30} height={30} /></a></li>
                          <li><a href="#"><Image src={'/instagram.svg'} className={styles.list_icon} alt="Instagram" width={30} height={30} /></a></li>
                          <li><a href="#"><Image src={'/twitter.svg'} className={styles.list_icon} alt="Twitter" width={30} height={30} /></a></li>
                          <li><a href="#"><Image src={'/Youtube-fill.svg'} className={styles.list_icon} alt="YouTube" width={30} height={30} /></a></li>
                      </ul>
                  </div>

                  {footerListData.map((item, index) => (
                      <div className={styles.footer_item_box} key={index}>
                          <h3>{item.title}</h3>
                          <ul className={styles.footer_item_list}>
                              {item.lists.map((list, index) => (
                                  <li key={list}>{list}</li>
                              ))}
                          </ul>
                      </div>
                  ))}
              </div>
          </footer>
      </>
  )
}