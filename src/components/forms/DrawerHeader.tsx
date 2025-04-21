import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DrawerHeaderProps {
    title: string;
    onClose: () => void;
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({ title, onClose }) => {
    return (
        <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
                <X size={20} />
            </Button>
        </div>
    );
};