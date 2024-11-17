// 在组件文件顶部添加 "use client"
"use client";
import { useState} from 'react';
import dynamic from 'next/dynamic';
import { Document, Page,pdfjs} from 'react-pdf';
import {PDFDocument, RotationTypes} from 'pdf-lib'; // 引入 pdf-lib
import Image from "next/image";
import styles from './pdfViewer.module.css';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//     '/pdf.worker.min.mjs',
//     import.meta.url,
// ).toString();
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;




const PDFViewer = (props: { pdfFile: any; fileName: string; handleRemove: () => void }) => {
    const [scale, setScale] = useState<number>(1);
    const [pageList, setPageList] = useState<any[]>([]);

    // Tooltip component
    const ToolTip = (component: JSX.Element, content: string, disabled = false) => (
        <div className={styles.tooltip}>
            {component}
            <div className={styles.tooltiptext} style={{ background: disabled ? '#908f8b' : '#282827' }}>
                <div className={styles.tooltip_content}>
                    <div
                        className={styles.triangle}
                        style={{ borderTop: disabled ? '10px solid #908f8b' : '10px solid #282827' }}
                    ></div>
                    <span>{content}</span>
                </div>
            </div>
        </div>
    );

    // Document load success handler
    const onDocumentLoadSuccess = ({ numPages }: any) => {
        const list = new Array(numPages).fill({}).map((item, index) => ({
            index,
            rotate: 0,
        }));
        setPageList(list);
    };

    // Zoom functionality
    const handleZoom = (zoom: string) => {
        if (zoom === 'in') {
            if (scale + 0.5 < 3) {
                setScale(scale + 0.5);
            }
        } else {
            if (scale - 0.5 > 0) {
                setScale(scale - 0.5);
            }
        }
    };

    // Update the rotation of a specific page
    const updateItemRotate = (index: number) => {
        const changedList = [...pageList];
        const selectIndex = changedList.findIndex((item) => item.index === index);
        if (selectIndex > -1) {
            changedList[selectIndex].rotate += 90;
            if (changedList[selectIndex].rotate > 360) changedList[selectIndex].rotate -= 360;
        }
        setPageList(changedList);
    };

    // Rotate all pages
    const updateAllItemsRotate = () => {
        const changedList = pageList.map((item) => {
            item.rotate += 90;
            if (item.rotate > 360) item.rotate -= 360;
            return item;
        });
        setPageList(changedList);
    };

    // Download the modified PDF
    const downloadPDF = async () => {
        try {
            const pdfBytes = await props.pdfFile.arrayBuffer();
            const header = new TextDecoder().decode(pdfBytes.slice(0, 4));
            if (header !== '%PDF') {
                throw new Error('Invalid PDF file format');
            }

            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pages = pdfDoc.getPages();

            pageList.forEach((item, index) => {
                const page = pages[index];
                page.setRotation({
                    type: RotationTypes.Degrees,
                    angle: item.rotate,
                });
            });

            const modifiedPdfBytes = await pdfDoc.save();
            const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `modified_${props.fileName}`;
            link.click();
        } catch (error) {
            console.error('Error while processing PDF:', error);
        }
    };

    // Remove PDF handler
    const clickRemovePDF = () => {
        props.handleRemove();
    };
    return (
        <>
            <ul
                className={styles.view_header}
            >
                <li>
                    <button className={styles.rotate_all} onClick={updateAllItemsRotate}>
                        Rotate all
                    </button>
                </li>
                <li>{ToolTip(<button className={styles.remove_pdf} onClick={clickRemovePDF}>Remove PDF</button>, 'Remove this PDF and select a new one')}</li>
                <li onClick={() => handleZoom('in')}>
                    {ToolTip(
                        <div className={styles.zoom_box}>
                            <img src={'/zoom-out.svg'} className={styles.zoom_icon} alt="zoomIn" width={20} height={20}/>
                        </div>, 'Zoom In', scale + 0.5 >= 3
                    )}
                </li>
                <li onClick={() => handleZoom('out')}>
                    {ToolTip(
                        <div className={styles.zoom_box}>
                            <Image src={'/zoom-in.svg'} className={styles.zoom_icon} alt="zoomOut" width={20} height={20}/>
                        </div>, 'Zoom Out', scale - 0.5 <= 0
                    )}
                </li>
            </ul>

            {/* Dynamically load the Document component on the client side */}

                <Document file={props.pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                    <div className={styles.page_list_box}>
                        {pageList.map((item, index) => (
                            <div className={styles.page_box} key={index}>
                                <div className={styles.rotate_box} onClick={() => updateItemRotate(index)}>
                                    <img src={'/arrows-rotate.svg'} className={styles.rotate_icon} alt="rotateIcon" />
                                </div>
                                <div style={{ transform: `rotate(${item.rotate}deg)` }}>
                                    <Page
                                        pageNumber={index + 1}
                                        key={index}
                                        width={180} // Set page width to 180px
                                        scale={scale}
                                    />
                                </div>
                                {index + 1}
                            </div>
                        ))}
                    </div>
                    <div className={styles.flex_center}>
                        {ToolTip(<button className={styles.rotate_all} onClick={downloadPDF}>Download</button>, 'Split and download PDF')}
                    </div>
                </Document>

        </>
    );
};

// 禁用 SSR
export default dynamic(() => Promise.resolve(PDFViewer), { ssr: false });