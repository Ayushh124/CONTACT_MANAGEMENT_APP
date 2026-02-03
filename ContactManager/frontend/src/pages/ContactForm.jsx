import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import api from '../utils/api';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

const ContactForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        company: '',
        tags: '',
        notes: '',
        isFavorite: false
    });
    const [loading, setLoading] = useState(false);
    // Error state removed as per request
    const [countryData, setCountryData] = useState({});

    useEffect(() => {
        if (isEditMode) {
            const fetchContact = async () => {
                try {
                    const { data } = await api.get('/contacts');
                    const contact = data.find(c => c._id === id);
                    if (contact) {
                        setFormData({
                            ...contact,
                            tags: contact.tags ? contact.tags.join(', ') : ''
                        });
                    }
                } catch (err) {
                    console.error('Failed to load contact', err);
                }
            };
            fetchContact();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (value, country) => {
        setFormData(prev => ({ ...prev, phone: value }));
        setCountryData(country);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validation logic removed as per request

        const payload = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        try {
            if (isEditMode) {
                await api.put(`/contacts/${id}`, payload);
            } else {
                await api.post('/contacts', payload);
            }
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to save contact', err);
            setLoading(false);
            alert('Failed to save contact. Please try again.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this contact?')) {
            try {
                await api.delete(`/contacts/${id}`);
                navigate('/dashboard');
            } catch (err) {
                console.error('Failed to delete contact', err);
                alert('Failed to delete contact. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Contact' : 'New Contact'}
                    </h1>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="p-6">
                        {/* Error banner removed */}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Full Name <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Phone <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="mt-1">
                                        <PhoneInput
                                            country={'in'}
                                            value={formData.phone}
                                            onChange={handlePhoneChange}
                                            enableSearch={true}
                                            inputStyle={{
                                                width: '100%',
                                                height: '38px',
                                                borderRadius: '0.375rem',
                                                borderColor: '#d1d5db',
                                                backgroundColor: 'white',
                                                paddingLeft: '48px'
                                            }}
                                            containerStyle={{
                                                width: '100%'
                                            }}
                                            dropdownStyle={{
                                                width: '300px'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Email <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Company</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        name="tags"
                                        placeholder="Family, Work, Friend"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                                    <textarea
                                        name="notes"
                                        rows={3}
                                        value={formData.notes}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between pt-5">
                                {isEditMode ? (
                                    <button
                                        type="button"
                                        onClick={handleDelete}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-900 hover:bg-red-800 focus:outline-none"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete
                                    </button>
                                ) : (
                                    <div></div> /* Spacer */
                                )}
                                <div className="flex gap-3">
                                    <Link
                                        to="/dashboard"
                                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:opacity-50"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Contact
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
