import {useEffect, useState} from "react";
import LeftNav from "@/components/leftnav";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {Table} from "react-bootstrap";
import Swal from "sweetalert2";
import Modal from "react-bootstrap/Modal";
import {Formik} from "formik";
import * as yup from "yup";
import Select from "react-select";


const apiUrl = 'https://run.mocky.io/v3/99530074-98e5-411a-836a-ce7b0d32d533';
const deleteUrl = 'https://jack25.free.beeceptor.com/delete';
const saveUrl = 'https://jack25.free.beeceptor.com/save';

export default function PdfManagement() {
    const [data, setData] = useState([]);
    const [doctorNames, setDoctorNames] = useState([]);
    const [idToEdit, setIdToEdit] = useState("");
    const [isValidSubmit, setIsValidSubmit] = useState(false);
    const [showEditWindow, setShowEditWindow] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const editData = data.find((item) => item.id === idToEdit);
    const schema = yup.object().shape({
        clinicName: yup.string().required(),
        doctor: yup.string().required(),
        email: yup.string().required(),
    });


    useEffect(() => {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((responseData) => {
                setData(responseData);
                const uniqueDoctorNames = [...new Set(responseData.map(item => item.doctor))];
                setDoctorNames(uniqueDoctorNames);
            })
            .catch((error) => {
                console.log("Error fetching data:", error);
            });
    }, []);

    const handleEditClick = (id) => {
        setShowEditWindow(true);
        setIdToEdit(id);
    };

    const handleSubmit = async (values) => {
        try {
            const response = await fetch(saveUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            if (response.ok) {
                console.log("Form data submitted successfully");
                const updatedResponse = await fetch(apiUrl);
                const updatedData = await updatedResponse.json();
                setData(updatedData);
                await Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: true,
                    timer: 1500,
                    timerProgressBar: true,
                })
            } else {
                console.error("Failed to submit form data");
            }
        } catch (error) {
            console.error("Error while submitting form:", error);
        }
        setShowEditWindow(false)
    };


    const showDeleteConfirmWindowClick = (id) => {
        Swal.fire({
            title: '確認刪除',
            text: "你確定要刪除這個項目嗎？",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '是的',
            cancelButtonText: '取消'
        }).then((result) => {
            if (result.isConfirmed) {
                sendDeleteRequest(id);
            }
        });
    };


    const sendDeleteRequest = (id) => {
        fetch(deleteUrl + "/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((response) => {
                if (response.ok) {
                    console.log("刪除成功");
                } else {
                    console.log("刪除時發生錯誤: ");
                }
            })
            .catch((error) => {
                console.log("發送刪除請求時發生錯誤: ", error)
            });
    };

    const handleModalClose = () => {
        setSelectedDoctor(null);
        setShowEditWindow(false);
    }

    return (
        <LeftNav>
            <div>
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <h2 className="mb-0">PDF管理</h2>
                    </div>
                </div>
            </div>
            <Table hover>
                <thead>
                <tr>
                    <th className="text-center align-middle">ID</th>
                    <th className="text-center align-middle">診所名稱</th>
                    <th className="text-center align-middle">醫生名稱</th>
                    <th className="text-center align-middle">電郵地址</th>
                    <th className="text-center align-middle">編輯</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td className="text-center align-middle">{item.id}</td>
                        <td className="text-center align-middle">{item.clinicName}</td>
                        <td className="text-center align-middle">{item.doctor}</td>
                        <td className="text-center align-middle">{item.email}</td>
                        <td className="text-center align-middle">
                            <div className="button-container d-grid gap-2 d-md-flex justify-content-center">
                                <Button className="btn btn-success" type="button"
                                        onClick={() => handleEditClick(item.id)}>編輯
                                </Button>
                                <Button className="btn btn-danger" type="button"
                                        onClick={() => showDeleteConfirmWindowClick(item.id)}>刪除
                                </Button>
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>


                <Modal show={showEditWindow} onHide={() => handleModalClose()}>
                    <Modal.Header closeButton>
                        <Modal.Title>編輯PDF</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            validationSchema={schema}
                            initialValues={editData || {
                                clinicName: '',
                                doctor: '',
                                email: '',
                            }}
                            onSubmit={handleSubmit}

                        >
                            {({handleSubmit, handleChange, values, touched, errors}) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="id">
                                        <Form.Label>ID : </Form.Label>
                                        <Form.Control
                                            type="text"
                                            onChange={handleChange}
                                            value={values.id}
                                            isInvalid={touched.id && !!errors.id}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="pdf">
                                        <Form.Label>閱覽 PDF 內容 : </Form.Label>
                                        <div>
                                            <iframe
                                                title="Embedded PDF"
                                                src="http://www.africau.edu/images/default/sample.pdf"
                                                width="100%"
                                                height="500px"
                                            />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="clinicName">
                                        <Form.Label>診所名稱</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            onChange={handleChange}
                                            value={values.clinicName}
                                            isInvalid={touched.clinicName && !!errors.clinicName}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            請輸入診所名稱。
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="doctor">
                                        <Form.Label>醫生名稱</Form.Label>
                                        <Select
                                            options={doctorNames.map(doctorName => ({
                                                value: doctorName,
                                                label: doctorName
                                            }))}
                                            onChange={option => {
                                                setSelectedDoctor(option.value);
                                                handleChange({target: {id: "doctor", value: option.value}});
                                            }}
                                            value={selectedDoctor ? {
                                                value: selectedDoctor,
                                                label: selectedDoctor
                                            } : {
                                                value: editData.doctor,
                                                label: editData.doctor
                                            }}
                                            isSearchable={true}
                                            placeholder="選擇醫生名稱..."
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>電郵地址</Form.Label>
                                        <Form.Control
                                            required
                                            type="text"
                                            onChange={handleChange}
                                            value={values.email}
                                            isInvalid={touched.email && !!errors.email}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            請輸入電郵地址。
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <div className="d-flex justify-content-end mt-3">
                                        <Button type="submit" >確定</Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>
            </Table>

        </LeftNav>

    );
};
