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
        e.preventDefault();
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

    // Helper to get initials
    const getInitials = (name) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Helper for random soft background color
    const getAvatarColor = (name) => {
        const colors = [
            'bg-red-100 text-red-700',
            'bg-blue-100 text-blue-700',
            'bg-green-100 text-green-700',
            'bg-yellow-100 text-yellow-700',
            'bg-purple-100 text-purple-700',
            'bg-pink-100 text-pink-700',
            'bg-indigo-100 text-indigo-700'
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
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
                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors"
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

                {/* Header Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

                    <div className="flex w-full sm:w-auto items-center gap-4">
                        <div className="relative flex-1 sm:flex-initial w-full sm:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm shadow-sm transition-all"
                                placeholder="Search contacts..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Link
                            to="/add-contact"
                            className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors whitespace-nowrap"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Contact
                        </Link>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTag === tag
                                ? 'bg-red-600 text-white shadow-md'
                                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Grid View */}
                {filteredContacts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredContacts.map((contact) => (
                            <div
                                key={contact._id}
                                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col"
                            >
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-bold ${getAvatarColor(contact.name)}`}>
                                            {getInitials(contact.name)}
                                        </div>
                                        {contact.tags && contact.tags.length > 0 && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {contact.tags[0]}
                                                {contact.tags.length > 1 && ` +${contact.tags.length - 1}`}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                                        {contact.name}
                                    </h3>
                                    {contact.company && (
                                        <p className="text-sm text-gray-500 mb-4 truncate">{contact.company}</p>
                                    )}

                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                            <span className="truncate">{contact.email}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                            <span className="truncate">{contact.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                                    <button
                                        onClick={(e) => toggleFavorite(e, contact)}
                                        className={`p-2 rounded-full transition-colors ${contact.isFavorite ? 'text-yellow-400 hover:bg-yellow-50' : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-100'}`}
                                        title={contact.isFavorite ? "Unfavorite" : "Favorite"}
                                    >
                                        <Star className={`h-5 w-5 ${contact.isFavorite ? 'fill-current' : ''}`} />
                                    </button>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/contact/${contact._id}`)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(e, contact._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <UserCircle className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by creating a new contact.
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/add-contact"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Add Contact
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

// Need access to UserCircle for empty state, better import it at top or keep simple text
// Added UserCircle to imports for the empty state
import { UserCircle } from 'lucide-react';

export default Dashboard;
