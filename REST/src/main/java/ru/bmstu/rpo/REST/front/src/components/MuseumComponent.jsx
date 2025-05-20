import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackendService from '../services/BackendService';

const MuseumComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Если id не -1, загружаем данные музея для редактирования
        if (id !== '-1') {
            BackendService.retrieveMuseum(id)
                .then(response => {
                    console.log("Загруженные данные музея:", response.data);
                    setName(response.data.name);
                    setLocation(response.data.location);
                })
                .catch(error => {
                    console.error("Ошибка загрузки музея:", error);
                    setErrorMessage("Ошибка при загрузке данных музея");
                });
        }
    }, [id]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);
        setErrorMessage('');

        if (name && location) {
            if (id === '-1') {
                // Создание нового музея
                const newMuseum = { name, location };
                BackendService.createMuseum(newMuseum)
                    .then(response => {
                        console.log("Музей успешно создан:", response.data);
                        navigate('/museums');
                    })
                    .catch(error => {
                        console.error("Ошибка создания музея:", error);
                        if (error.response && error.response.data && error.response.data.message) {
                            setErrorMessage(error.response.data.message);
                        } else {
                            setErrorMessage("Ошибка при создании музея");
                        }
                    });
            } else {
                // Обновление существующего музея
                const updatedMuseum = {
                    id: id,
                    name,
                    location
                };

                BackendService.updateMuseum(updatedMuseum)
                    .then(response => {
                        console.log("Музей успешно обновлен:", response.data);
                        navigate('/museums');
                    })
                    .catch(error => {
                        console.error("Ошибка обновления музея:", error);
                        if (error.response && error.response.data && error.response.data.message) {
                            setErrorMessage(error.response.data.message);
                        } else {
                            setErrorMessage("Ошибка при обновлении музея");
                        }
                    });
            }
        }
    };

    const handleCancel = () => {
        navigate('/museums');
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 mt-5">
                    <h2>{id === '-1' ? 'Добавление музея' : 'Редактирование музея'}</h2>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-4 mt-4">
                            <label htmlFor="name" className="form-group mb-2">Название</label>
                            <input
                                id="name"
                                type="text"
                                className={`form-control ${submitted && !name ? 'is-invalid' : ''}`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label htmlFor="name" className="form-group mb-2">Расположеие</label>
                            <input
                                id="location"
                                type="text"
                                className={`form-control ${submitted && !name ? 'is-invalid' : ''}`}
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                            {submitted && !name && !location && <div className="invalid-feedback">Все поля должны быть заполнены</div>}
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

export default MuseumComponent;