"use client"
import { Faster_One } from 'next/font/google';
import Image from 'next/image'
import cn from 'classnames';
import { useEffect, useCallback, useRef, useState } from 'react';
import styles from "./uploadCard.module.css";
import "../app/globals.css";
import uploadIcon from '../img/upload64x64.png';
import trashIcon from '../img/trash80x80.png';
import { useDropzone, type Accept, type DropzoneOptions } from 'react-dropzone';


type Props = {
    onFileUpload?: (file: File | null) => void,
    fileLabel?: string
}

export default function UploadCard( {onFileUpload, fileLabel = "PDF file"}: Props ) {
    const [hover, setHover] = useState(false);
    const [pdfFile, setPdfFile] = useState<File | null> (null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const MAX_FILE_SIZE_MB = 20; //20 MB limit

    // Validate file size and type
    const validateFile = (file: File): boolean => {
        if (file.type !== "application/pdf") {
            setErrorMessage("Invalid file type. Please upload a PDF file.");
            return false;
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            setErrorMessage(`File size exceeds ${MAX_FILE_SIZE_MB} MB. Please upload a smaller file.`);
            return false;
        }
        setErrorMessage(null);
        return true;
    };

    const handleFileRemoval = () => {
        setPdfFile(null);
        if (onFileUpload) {
            onFileUpload(null);
        }
    }


    // Case for Drag and Drop
    const handlePageDrop = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type === "application/pdf") {
                if(validateFile(file)) {
                    setPdfFile(file);
                    if (onFileUpload) {
                        onFileUpload(file);
                    }
                }
            }
        }
        setIsDragOver(false);
    }, [onFileUpload, fileLabel]);

    const handlePageDragOver = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(true);
    }, []);
    
    const handlePageDragLeave = useCallback((event: DragEvent) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragOver(false);
    }, []);

    const onDragEnter = () => setIsDragOver(true);
    const onDragLeave = () => setIsDragOver(false);
    const onDragOver = () => setIsDragOver(true);

    useEffect(() => {
        window.addEventListener("dragover", handlePageDragOver);
        window.addEventListener("dragleave", handlePageDragLeave);
        window.addEventListener("drop", handlePageDrop);
        return () => {
            window.removeEventListener("dragover", handlePageDragOver);
            window.removeEventListener("dragleave", handlePageDragLeave);
            window.removeEventListener("drop", handlePageDrop);
        };
    }, [handlePageDragLeave, handlePageDragOver, handlePageDrop]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (validateFile(file)) {
                setPdfFile(file);
                if (onFileUpload) {
                    onFileUpload(file); // Tripper upload callback
                }
            }
        }
        setIsDragOver(false);
    }, [onFileUpload, fileLabel]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: false,
        onDragEnter,
        onDragOver,
        onDragLeave
    });

    return (
        <div className={styles.card} >
            <div
                className={styles.container}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
            >
                <div className={cn([
                styles.dotted,
                (isDragActive ? styles["dotted-hover"] : "")
                ])}>
                
                { !pdfFile && (
                    <input 
                        {...getInputProps()} 
                        accept="application/pdf"
                        style={{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            opacity: "0%",
                            cursor: "pointer",
                            zIndex: 2
                        }} 
                    />
                )}

                {(pdfFile ? (
                    <>
                        <Image 
                            className={styles["trash-icon"]} 
                            alt="Trash" 
                            src={trashIcon} 
                            onClick={() => setPdfFile(null)} 
                        />
                        <div className={styles["upload-container"]}>
                            <p className={styles["upload-label"]}>
                                {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        </div>
                    </>
                    ) : (
                        <>
                            <Image
                                src={uploadIcon}
                                className={cn([
                                    styles["upload-icon"],
                                    hover ? styles["upload-icon-hover"] : ""
                                ])}
                                alt = "Upload a PDF File"
                            />
                            <div className={styles["upload-container"]}>
                                <p className={styles["upload-label"]}>
                                    Drag and drop a PDF file to upload or
                                </p>
                                <button 
                                    className={cn([
                                        styles["upload-button"], 
                                        (hover ? styles["upload-button-hover"] : "")
                                    ])}>
                                    <p className={styles["upload-button-label"]}>Browse files</p>
                                </button>
                            </div>
                        </>
                    )
                )}
                </div>
                {errorMessage && (
                    <p className={styles["error-message"]}>{errorMessage}</p>
                )}
            </div>
        </div>
    )
}