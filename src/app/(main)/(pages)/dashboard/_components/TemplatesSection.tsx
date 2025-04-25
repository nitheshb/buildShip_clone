import React, { useState } from 'react';
import { Search } from 'lucide-react';
import TemplateCard from '@/components/cards/TemplateCard';

export const templateData = [
    {
        title: "MySQL",
        value: "chat_with_mysql",
        description: "Connect and manage your MySQL databases with ease.",
        icons: ['mysql.svg'],
    },
    {
        title: "PostgreSQL",
        value: "chat_with_postgresql",
        description: "Manage your PostgreSQL databases securely.",
        icons: ['postgresql.svg'],
    },
    {
        title: "Supabase",
        value: "chat_with_supabase",
        description: "Connect to your Supabase and manage your data securely.",
        icons: ['supabase.svg'],
    },
    {
        title: "Neon",
        value: "chat_with_neon",
        description: "Connect and manage your Neon database securely.",
        icons: ['neon.svg'],
    },
    {
        title: "Firestore",
        value: "chat_with_firestore",
        description: "Connect to your Firestore instances.",
        icons: ['firestore.svg'],
    },
    {
        title: "MongoDB",
        value: "chat_with_mongodb",
        description: "Connect to your MongoDB instances and manage collections.",
        icons: ['mongodb.svg'],
    },
    {
        title: "PdfQuery",
        value: "chat_with_pdf",
        description:
            "Chat with OpenAI and get answers to the questions asked from the PDF.",
        icons: ['pdf.svg', 'openai.svg'],
    },
    {
        title: "ExcelQuery",
        value: "chat_with_excel",
        description:
            "Chat with OpenAI and get answers to the questions asked from the uploaded Excel sheet.",
        icons: ['excel.svg', 'openai.svg'],
    }
];

interface TemplatesSectionProps {
    onConnect: (templateValue: string) => void;
}

const TemplatesSection: React.FC<TemplatesSectionProps> = ({ onConnect }) => {
    const [searchTemplate, setSearchTemplate] = useState('');

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTemplate(e.target.value);
    };

    const filteredTemplates = templateData.filter(template =>
        template.title.toLowerCase().includes(searchTemplate.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTemplate.toLowerCase())
    );

    return (
        <>
            <div className="flex items-center justify-end mb-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="search"
                        placeholder="Search templates..."
                        value={searchTemplate}
                        onChange={handleSearchChange}
                        className="pl-10 pr-4 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-700 w-[300px]"
                    />
                </div>
            </div>

            {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredTemplates.map((template, index) => (
                        <TemplateCard
                            key={index}
                            title={template.title}
                            value={template.value}
                            description={template.description}
                            icons={template.icons}
                            onConnect={onConnect}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center p-8 text-gray-500">
                    No templates match your search
                </div>

            )}
        </>
    );
};

export default TemplatesSection;