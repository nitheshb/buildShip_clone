import React from 'react';

interface ProgressBarProps {
    currentStep: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
    return (
        <div className="px-6 pt-4">
            <div className="relative">
                <div className="overflow-hidden h-2 flex rounded bg-muted">
                    <div
                        className="bg-primary transition-all duration-300"
                        style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                    ></div>
                </div>
                <div className="flex justify-between mt-1">
                    <span className={`text-xs ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                        Connection
                    </span>
                    <span className={`text-xs ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                        Tables
                    </span>
                    <span className={`text-xs ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                        Columns
                    </span>
                </div>
            </div>
        </div>
    );
};