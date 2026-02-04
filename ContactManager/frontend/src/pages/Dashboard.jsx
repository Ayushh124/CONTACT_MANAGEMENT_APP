import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Plus, Search, Star, Phone, Mail, Pencil, Trash2, Contact2 } from 'lucide-react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedTag, setSelectedTag] = useState('All');
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchContacts = async () => {
        try {
            const { data } = await api.get(`/contacts${search ? `?search=${search}` : ''}`);
            setContacts(data);
        } catch (error) {
            console.error('Error fetching contacts', error);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchContacts();
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [search]);

    const toggleFavorite = async (e, contact) => {
        e.preventDefault(); // Prevent navigation if used in link
        try {
            const updatedContact = { ...contact, isFavorite: !contact.isFavorite };
            // Optimistic update
            setContacts(contacts.map(c => c._id === contact._id ? updatedContact : c));
            await api.put(`/contacts/${contact._id}`, updatedContact);
        } catch (error) {
            console.error('Error updating favorite', error);
            // Revert changes on error
            fetchContacts();
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        if (window.confirm("Are you sure you want to delete this contact?")) {
            try {
                await api.delete(`/contacts/${id}`);
                setContacts(contacts.filter(c => c._id !== id));
            } catch (error) {
                console.error("Error deleting contact", error);
            }
        }
    };

    const allTags = ['All', ...new Set(contacts.flatMap(contact => contact.tags || []))].filter(Boolean);

    const filteredContacts = selectedTag === 'All'
        ? contacts
        : contacts.filter(contact => contact.tags && contact.tags.includes(selectedTag));

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-2">
                            <Contact2 className="w-6 h-6 text-red-600" />
                            <span className="text-xl font-bold text-gray-900">ContactManager</span>
                        </div>
                        <div className="flex items-center">
                            <button
                                onClick={() => {
                                    alert("Logout successfully!");
                                    logout();
                                }}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

                    <div className="flex w-full sm:w-auto gap-4">
                        <div className="relative flex-1 sm:flex-initial">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                                placeholder="Search contacts..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Link
                            to="/add-contact"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Contact
                        </Link>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${selectedTag === tag
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {filteredContacts.map((contact) => (
                            <li key={contact._id}>
                                <Link to={`/contact/${contact._id}`} className="block hover:bg-gray-50 transition duration-150 ease-in-out">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <p className="text-sm font-medium text-red-600 truncate mr-2">{contact.name}</p>
                                                {contact.tags && contact.tags.map((tag, index) => (
                                                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-1">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="ml-2 flex-shrink-0 flex space-x-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        navigate(`/contact/${contact._id}`);
                                                    }}
                                                    className="p-1 rounded-full text-blue-600 hover:bg-gray-100"
                                                    title="Edit"
                                                >
                                                    <Pencil className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(e, contact._id)}
                                                    className="p-1 rounded-full text-red-600 hover:bg-red-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        toggleFavorite(e, contact);
                                                    }}
                                                    className={`p-1 rounded-full hover:bg-gray-100 ${contact.isFavorite ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    title="Favorite"
                                                >
                                                    <Star className="h-5 w-5 fill-current" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500 mr-6">
                                                    <Mail className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                    {contact.email}
                                                </p>
                                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                    <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                                    {contact.phone}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                                {contact.company && <p>{contact.company}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))}
                        {filteredContacts.length === 0 && (
                            <li className="px-4 py-8 text-center text-gray-500">
                                No contacts found.
                            </li>
                        )}
                    </ul>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
