import {useEffect, useState} from "react";
import LeftNav from "@/components/leftnav";
import { Document, Page } from 'react-pdf';
import Modal from "react-bootstrap/Modal";
import { pdfjs } from 'react-pdf';
export default function Home() {
    const [showPDFModal, setShowPDFModal] = useState(false);
    const [selectedPDFUrl, setSelectedPDFUrl] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    useEffect(() => {
        // 設定 pdf.worker.js 的路徑
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`; // 替換為你的 pdf.worker.js 的路徑

        // 在這裡執行你的其他程式碼
        // 例如，fetch PDF 資料，設定初始狀態，等等
    }, []);

    const onPDFLoadSuccess = ({ numPages }) => {
        console.log('PDF 加载成功，总页数：', numPages);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setSelectedPDFUrl(url);
            setPageNumber(1);
            setShowPDFModal(true);
        }
    };

    return (
        <LeftNav>
            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
            />
            <Modal show={showPDFModal} onHide={() => setShowPDFModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>閱覽 PDF 內容</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="pdf-container">
                        <Document
                            file={selectedPDFUrl}
                            onLoadSuccess={onPDFLoadSuccess}
                        >
                            <Page pageNumber={pageNumber} />
                        </Document>
                    </div>
                </Modal.Body>
            </Modal>
        </LeftNav>

    );
};
