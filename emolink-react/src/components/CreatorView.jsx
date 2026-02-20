import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Sparkles, MessageCircle, AlertTriangle, RefreshCcw } from 'lucide-react';
import { TEMPLATES } from '../constants';
import { encodeData } from '../utils/encoding';
import ReceiverView from './ReceiverView';

const CreatorView = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [formData, setFormData] = useState({
        receiver: '',
        message: '',
        sender: ''
    });
    const [generatedLink, setGeneratedLink] = useState('');
    const [copied, setCopied] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [errors, setErrors] = useState({});
    const resultsRef = useRef(null);

    const isLocal = typeof window !== 'undefined' &&
        (window.location.protocol === 'file:' ||
            window.location.hostname === 'localhost' ||
            window.location.hostname === '127.0.0.1');

    const validateForm = () => {
        const newErrors = {};
        if (!selectedTemplate) newErrors.template = 'Please choose a moment first';
        if (!formData.receiver.trim()) newErrors.receiver = "Receiver's name is required";
        if (!formData.message.trim()) newErrors.message = 'A heartfelt message is required';
        if (!formData.sender.trim()) newErrors.sender = "Your name is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGenerate = () => {
        if (!validateForm()) return;

        const data = {
            template: selectedTemplate,
            receiver: formData.receiver.trim(),
            message: formData.message.trim(),
            sender: formData.sender.trim(),
            timestamp: Date.now()
        };

        const encoded = encodeData(data);
        const baseUrl = window.location.href.split('?')[0];
        const url = `${baseUrl}?card=${encoded}`;
        setGeneratedLink(url);

        // Scroll to results
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const togglePreview = () => {
        if (!validateForm()) return;
        setPreviewMode(!previewMode);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOnWhatsApp = () => {
        const text = `Hey ${formData.receiver || 'there'}! I've created something special for you. Follow the link to see it: ${generatedLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    if (previewMode) {
        const previewData = {
            template: selectedTemplate,
            receiver: formData.receiver,
            message: formData.message,
            sender: formData.sender
        };
        // We'll need to import ReceiverView or handle it differently.
        // For now, let's assume we can just pass it back or use a specialized Preview component.
        // Actually, since this is EXECUTION, I should probably handle the import if I want to use ReceiverView.
        return (
            <div className="fixed inset-0 z-[100] bg-[#1a1a2e] overflow-y-auto">
                <div className="absolute top-8 left-8 z-[110]">
                    <button
                        onClick={() => setPreviewMode(false)}
                        className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-md border border-white/20 transition-all font-semibold flex items-center gap-2"
                    >
                        <RefreshCcw className="w-5 h-5" />
                        Back to Editor
                    </button>
                </div>
                <ReceiverView data={previewData} onReplay={() => { }} isPreview={true} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <header className="text-center mb-16">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-playfair text-6xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-300"
                >
                    EmoLink
                </motion.h1>
                <p className="text-xl text-blue-100/80">Create magical emotional moments with countdown reveals</p>
            </header>

            <div className="glass rounded-[2rem] p-8 md:p-12">
                {/* Step 1: Choose Template */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                        <span className="bg-yellow-400 text-purple-900 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">1</span>
                        Choose Your Moment
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.entries(TEMPLATES).map(([key, template]) => (
                            <motion.div
                                key={key}
                                whileHover={{ y: -5, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                    setSelectedTemplate(key);
                                    setErrors({ ...errors, template: null });
                                }}
                                className={`cursor-pointer rounded-2xl p-6 text-center transition-all duration-300 ${selectedTemplate === key
                                    ? 'ring-4 ring-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]'
                                    : 'bg-white/5 hover:bg-white/10'
                                    } bg-gradient-to-br ${template.bg}`}
                            >
                                <div className="text-6xl mb-4">{template.emoji}</div>
                                <h3 className="font-bold text-xl mb-1">{template.title}</h3>
                                <p className="text-sm opacity-80">{template.description}</p>
                            </motion.div>
                        ))}
                    </div>
                    {errors.template && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm mt-4 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" /> {errors.template}
                        </motion.p>
                    )}
                </div>

                {/* Step 2: Personalize */}
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-8 flex items-center gap-3">
                        <span className="bg-yellow-400 text-purple-900 rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold">2</span>
                        Personalize Your Message
                    </h2>
                    <div className="space-y-6">
                        <div className="relative group">
                            <label className="block text-sm font-medium mb-2 text-blue-200">Receiver's Name</label>
                            <input
                                type="text"
                                placeholder="e.g., Sarah"
                                value={formData.receiver}
                                onChange={(e) => {
                                    setFormData({ ...formData, receiver: e.target.value });
                                    setErrors({ ...errors, receiver: null });
                                }}
                                className={`w-full px-6 py-4 rounded-2xl bg-white/10 border ${errors.receiver ? 'border-red-500' : 'border-white/20'} focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all placeholder:text-white/30`}
                            />
                            {errors.receiver && <p className="text-red-400 text-xs mt-1 ml-2">{errors.receiver}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-blue-200">Your Heartfelt Message</label>
                            <textarea
                                rows="4"
                                placeholder="Write something beautiful..."
                                value={formData.message}
                                onChange={(e) => {
                                    setFormData({ ...formData, message: e.target.value });
                                    setErrors({ ...errors, message: null });
                                }}
                                className={`w-full px-6 py-4 rounded-2xl bg-white/10 border ${errors.message ? 'border-red-500' : 'border-white/20'} focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all placeholder:text-white/30 resize-none`}
                            ></textarea>
                            {errors.message && <p className="text-red-400 text-xs mt-1 ml-2">{errors.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-blue-200">Your Name (Sender)</label>
                            <input
                                type="text"
                                placeholder="e.g., John"
                                value={formData.sender}
                                onChange={(e) => {
                                    setFormData({ ...formData, sender: e.target.value });
                                    setErrors({ ...errors, sender: null });
                                }}
                                className={`w-full px-6 py-4 rounded-2xl bg-white/10 border ${errors.sender ? 'border-red-500' : 'border-white/20'} focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all placeholder:text-white/30`}
                            />
                            {errors.sender && <p className="text-red-400 text-xs mt-1 ml-2">{errors.sender}</p>}
                        </div>
                    </div>
                </div>

                {/* Step 3: Generate */}
                <div className="flex flex-col md:flex-row justify-center gap-6 mt-12">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={togglePreview}
                        className="bg-white/10 hover:bg-white/20 text-white font-bold py-5 px-12 rounded-2xl text-xl border border-white/20 transition-all flex items-center justify-center gap-3"
                    >
                        <RefreshCcw className="w-6 h-6" />
                        Preview Magic
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleGenerate}
                        className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold py-5 px-12 rounded-2xl text-xl shadow-xl hover:shadow-[0_0_30px_rgba(250,204,21,0.5)] transition-all flex items-center justify-center gap-3"
                    >
                        <Sparkles className="w-6 h-6 animate-pulse" />
                        Generate Magic Link
                    </motion.button>
                </div>

                {/* Results */}
                <AnimatePresence>
                    {generatedLink && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-12 overflow-hidden"
                            ref={resultsRef}
                        >
                            <div className="p-8 bg-black/30 rounded-3xl border border-white/10 space-y-6">
                                <div className="flex flex-col md:flex-row gap-4 items-center">
                                    <div className="flex-1 bg-white/5 px-6 py-4 rounded-2xl border border-white/10 font-mono text-sm break-all">
                                        {generatedLink}
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <button
                                            onClick={handleCopy}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-4 rounded-2xl transition-all"
                                        >
                                            {copied ? <Sparkles className="text-yellow-400 w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                            {copied ? 'Copied!' : 'Copy'}
                                        </button>
                                        <button
                                            onClick={shareOnWhatsApp}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-4 rounded-2xl hover:scale-105 transition-all shadow-lg"
                                        >
                                            <MessageCircle className="w-5 h-5" />
                                            WhatsApp
                                        </button>
                                    </div>
                                </div>

                                {isLocal && (
                                    <div className="flex items-start gap-3 p-4 bg-yellow-400/10 rounded-2xl border border-yellow-400/30">
                                        <AlertTriangle className="text-yellow-400 shrink-0 w-6 h-6" />
                                        <p className="text-sm text-yellow-200/90 leading-relaxed">
                                            <strong>Note:</strong> You're running this locally. For others to see your card, you'll need to upload this project to a host like Vercel, Netlify, or GitHub Pages.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CreatorView;
