import {useEffect, useState} from "react";
import LeftNav from "@/components/leftnav";
import { Document, Page } from 'react-pdf';
import Modal from "react-bootstrap/Modal";
import { pdfjs } from 'react-pdf';
import {Table} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {Formik} from "formik";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import * as yup from "yup";
import Swal from "sweetalert2";
const apiUrl = 'https://run.mocky.io/v3/99530074-98e5-411a-836a-ce7b0d32d533';
const deleteUrl = 'https://jack25.free.beeceptor.com/delete';
const saveUrl = 'https://jack25.free.beeceptor.com/save';

export default function AccountManagement() {
    const [data, setData] = useState([]);
    const [roles, setRoles] = useState([]);
    const [idToEdit, setIdToEdit] = useState("");
    const [isValid, setIsValid] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [showEditWindow, setShowEditWindow] = useState(false);
    const editData = data.find((item) => item.id === idToEdit);
    const schema = yup.object().shape({
        // clinicName: yup.string().required(),
        // doctor: yup.string().required(),
        // email: yup.string().required(),
    });
    useEffect(() => {
        fetch(apiUrl)
            .then((response) => response.json())
            .then((responseData) => {
                setData(responseData);
                const uniqueRoles = [...new Set(responseData.map(item => item.role))];
                setRoles(uniqueRoles);
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
        setIsValid(null);
        setShowEditWindow(false);
    }


    return (
        <LeftNav>
            <div>
                <div className="mb-3 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <h2 className="mb-0">帳號管理</h2>
                    </div>
                </div>
            </div>
            <Table hover>
                <thead>
                <tr>
                    <th className="text-center align-middle">帳號名稱</th>
                    <th className="text-center align-middle">電郵地址</th>
                    <th className="text-center align-middle">帳號角色</th>
                    <th className="text-center align-middle">有效性</th>
                    <th className="text-center align-middle">編輯</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td className="text-center align-middle">{item.accountName}</td>
                        <td className="text-center align-middle">{item.email}</td>
                        <td className="text-center align-middle">{item.role}</td>
                        <td className="text-center align-middle">{item.isValid ? "有效" : "無效"}</td>
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
                                accountName: '',
                                email: '',
                                role: '',
                                isValid: false,
                            }}
                            onSubmit={handleSubmit}
                        >
                            {({handleSubmit, handleChange, values, touched, errors}) => (
                                <Form noValidate onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="accountName">
                                        <Form.Label>帳號名稱 : </Form.Label>
                                        <Form.Control
                                            type="text"
                                            onChange={handleChange}
                                            value={values.accountName}
                                            isInvalid={touched.accountName && !!errors.accountName}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            請輸入帳號名稱。
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="email">
                                        <Form.Label>診所名稱</Form.Label>
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
                                    <Form.Group className="mb-3" controlId="role">
                                        <Form.Label>帳號角色</Form.Label>
                                        <Select
                                            options={roles.map(role => ({
                                                value: role,
                                                label: role
                                            }))}
                                            onChange={option => {
                                                setSelectedRole(option.value)
                                                handleChange({target: {id: "role", value: option.value}});
                                            }}
                                            value={selectedRole ? {
                                                value: selectedRole,
                                                label: selectedRole
                                            } : {
                                                value: editData.role,
                                                label: editData.role
                                            }}
                                            isSearchable={true}
                                            placeholder="選擇帳號角色..."
                                        />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="isValid">
                                        <Form.Label>有效性</Form.Label>
                                        <Form.Check
                                            type="switch"
                                            id="isValidSwitch"
                                            checked={values.isValid}
                                            onChange={() => handleChange({ target: { id: 'isValid', value: !values.isValid } })}
                                        />
                                    </Form.Group>
                                    <div className="d-flex justify-content-end mt-3">
                                        <Button type="submit">確定</Button>
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
