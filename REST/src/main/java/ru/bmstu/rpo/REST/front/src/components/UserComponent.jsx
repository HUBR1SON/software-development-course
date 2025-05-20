import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackendService from '../services/BackendService';

const UserComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Если id не -1, загружаем данные пользователя для редактирования
        if (id !== '-1') {
            BackendService.retrieveUser(id)
                .then(response => {
                    console.log("Загруженные данные пользователя:", response.data);
                    setName(response.data.name);
                })
                .catch(error => {
                    console.error("Ошибка загрузки пользователя:", error);
                    setErrorMessage("Ошибка при загрузке данных пользователя");
                });
        }
    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
        setErrorMessage('');

        if (name) {
            if (id === '-1') {
                // Создание нового пользователя
                const newUser = { name };
                BackendService.createUser(newUser)
                    .then(response => {
                        console.log("Пользователь успешно создан:", response.data);
                        navigate('/users');
                    })
                    .catch(error => {
                        console.error("Ошибка создания пользователя:", error);
                        if (error.response && error.response.data && error.response.data.message) {
                            setErrorMessage(error.response.data.message);
                        } else {
                            setErrorMessage("Ошибка при создании пользователя");
                        }
                    });
            } else {
                // Обновление существующего пользователя
                const updatedUser = {
                    id: id,
                    name
                };

                BackendService.updateUser(updatedUser)
                    .then(response => {
                        console.log("Пользователь успешно обновлен:", response.data);
                        navigate('/users');
                    })
                    .catch(error => {
                        console.error("Ошибка обновления пользователя:", error);
                        if (error.response && error.response.data && error.response.data.message) {
                            setErrorMessage(error.response.data.message);
                        } else {
                            setErrorMessage("Ошибка при обновлении пользователя");
                        }
                    });
            }
        }
    };

    const handleCancel = () => {
        navigate('/users');
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 mt-5">
                    <h2>{id === '-1' ? 'Добавление пользователя' : 'Редактирование пользователя'}</h2>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-4 mt-4">
                            <label htmlFor="name" className="form-group mb-2">Логин</label>
                            <input
                                id="name"
                                type="text"
                                className={`form-control ${submitted && !name ? 'is-invalid' : ''}`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {submitted && !name && <div className="invalid-feedback">Введите логин пользователя</div>}
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary me-2">Сохранить</button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancel}>Отмена</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserComponent;