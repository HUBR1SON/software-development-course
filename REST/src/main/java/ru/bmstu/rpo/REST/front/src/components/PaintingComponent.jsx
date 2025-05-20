import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackendService from '../services/BackendService';

const PaintingComponent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [year, setYear] = useState('');
    const [artistId, setArtistId] = useState('');
    const [museumID, setMuseumId] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Если id не -1, загружаем данные картины для редактирования
        if (id !== '-1') {
            BackendService.retrievePainting(id)
                .then(response => {
                    console.log("Загруженные данные картины:", response.data);
                    setName(response.data.name);
                    setYear(response.data.year);
                    setArtistId(response.data.artist.id);
                    setMuseumId(response.data.museum.id);
                })
                .catch(error => {
                    console.error("Ошибка загрузки картины:", error);
                    setErrorMessage("Ошибка при загрузке данных картины");
                });
        }
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitted(true);
        setErrorMessage('');

        if (name) {
            const artist_resp = await BackendService.retrieveArtist(artistId);
            const museum_resp = await BackendService.retrieveMuseum(museumID);
            const artist = artist_resp.data;
            const museum = museum_resp.data;
            if (id === '-1') {
                // Создание новой картины
                const newPainting = {name, year, artist, museum};
                BackendService.createPainting(newPainting)
                    .then(response => {
                        console.log("Картина успешно создана:", response.data);
                        navigate('/paintings');
                    })
                    .catch(error => {
                        console.error("Ошибка создания картины:", error);
                        if (error.response && error.response.data && error.response.data.message) {
                            setErrorMessage(error.response.data.message);
                        } else {
                            setErrorMessage("Ошибка при создании картины");
                        }
                    });
            } else {
                // Обновление существующей картины
                const updatedPainting = {
                    id: id,
                    name,
                    artist,
                    museum
                };

                BackendService.updatePainting(updatedPainting)
                    .then(response => {
                        console.log("Картина успешно обновлена:", response.data);
                        navigate('/paintings');
                    })
                    .catch(error => {
                        console.error("Ошибка обновления картины:", error);
                        if (error.response && error.response.data && error.response.data.message) {
                            setErrorMessage(error.response.data.message);
                        } else {
                            setErrorMessage("Ошибка при обновлении картины");
                        }
                    });
            }
        }
    };

    const handleCancel = () => {
        navigate('/paintings');
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 mt-5">
                    <h2>{id === '-1' ? 'Добавление картины' : 'Редактирование картины'}</h2>
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
                            <label htmlFor="year" className="form-group mb-2">Год</label>
                            <input
                                id="year"
                                type="text"
                                className={`form-control ${submitted && !name ? 'is-invalid' : ''}`}
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            />
                            <label htmlFor="artistId" className="form-group mb-2">Художник</label>
                            <input
                                id="artistId"
                                type="text"
                                className={`form-control ${submitted && !name ? 'is-invalid' : ''}`}
                                value={artistId}
                                onChange={(e) => setArtistId(e.target.value)}
                            />
                            <label htmlFor="museumID" className="form-group mb-2">Музей</label>
                            <input
                                id="museumID"
                                type="text"
                                className={`form-control ${submitted && !name ? 'is-invalid' : ''}`}
                                value={museumID}
                                onChange={(e) => setMuseumId(e.target.value)}
                            />
                            {submitted && !name && !year && artistId && museumID
                                && <div className="invalid-feedback">Все поля должны быть заполнены</div>}
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

export default PaintingComponent;