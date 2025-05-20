import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackendService from '../services/BackendService';

const ArtistComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [countryID, setCountryID] = useState('');
    const [century, setCentury] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Если id не -1, загружаем данные художника для редактирования
        if (id !== '-1') {
            BackendService.retrieveArtist(id)
                .then(response => {
                    console.log("Загруженные данные художника:", response.data);
                    setName(response.data.name);
                    if (response.data.century) { setCentury(response.data.century); }
                    if (response.data.country.id) { setCountryID(response.data.country.id); }
                })
                .catch(error => {
                    console.error("Ошибка загрузки художника:", error);
                    setErrorMessage("Ошибка при загрузке данных художника");
                });
        }
    }, [id]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitted(true);
        setErrorMessage('');

        if (name && century && countryID) {
            const resp = await BackendService.retrieveCountry(countryID);
            const country = resp.data;
            if (id === '-1') {
                // Создание нового художника
                const newArtist = {
                    name,
                    century,
                    country
                };
                BackendService.createArtist(newArtist)
                    .then(response => {
                        console.log("Художник успешно создан:", response.data);
                        navigate('/artists');
                    })
                    .catch(error => {
                        console.error("Ошибка создания художника:", error);
                        if (error.response && error.response.data && error.response.data.message) {
                            setErrorMessage(error.response.data.message);
                        } else {
                            setErrorMessage("Ошибка при создании художника");
                        }
                    });
            } else {
                // Обновление существующего художника
                const updatedArtist = {
                    id: id,
                    name,
                    century,
                    country
                };

                BackendService.updateArtist(updatedArtist)
                    .then(response => {
                        console.log("Художник успешно обновлен:", response.data);
                        navigate('/artists');
                    })
                    .catch(error => {
                        console.error("Ошибка обновления художника:", error);
                        if (error.response.status === 404) {
                            setErrorMessage("Указанная страна не найдена в базе");
                        } else if (error.response && error.response.data && error.response.data.message) {
                            setErrorMessage(error.response.data.message);
                        } else {
                            setErrorMessage("Ошибка при обновлении художника");
                        }
                    });
            }
        }
    };

    const handleCancel = () => {
        navigate('/artists');
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 mt-5">
                    <h2>{id === '-1' ? 'Добавление художника' : 'Редактирование художника'}</h2>
                    {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group mb-4 mt-4">
                            <label htmlFor="name" className="form-group mb-2">Имя</label>
                            <input
                                id="name"
                                type="text"
                                className={`form-control ${submitted && !name ? 'is-invalid' : ''}`}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label htmlFor="name" className="form-group mb-2">Страна</label>
                            <input
                                id="country"
                                type="number"
                                className={`form-control ${submitted && !countryID ? 'is-invalid' : ''}`}
                                value={countryID}
                                onChange={(e) => setCountryID(e.target.value)}
                            />
                            <label htmlFor="name" className="form-group mb-2">Век</label>
                            <input
                                id="century"
                                type="text"
                                className={`form-control ${submitted && !century ? 'is-invalid' : ''}`}
                                value={century}
                                onChange={(e) => setCentury(e.target.value)}
                            />
                            {submitted && !name && !countryID && !century &&
                                <div className="invalid-feedback">Все поля должны быть заполнены</div>}
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

export default ArtistComponent;