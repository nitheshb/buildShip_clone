import React from 'react';
import { Button } from '@/components/ui/button';

interface DrawerFooterProps {
    currentStep: number;
    isFileUpload: boolean;
    isLoading: boolean;
    selectedTablesCount: number;
    onCancel: () => void;
    onPrevious: () => void;
    onNext: () => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    onFileSubmit: (e: React.FormEvent) => Promise<void>;
}

export const DrawerFooter: React.FC<DrawerFooterProps> = ({
    currentStep,
    isFileUpload,
    isLoading,
    selectedTablesCount,
    onCancel,
    onPrevious,
    onNext,
    onSubmit,
    onFileSubmit
}) => {
    if (currentStep === 1) {
        return (
            <div className="flex gap-3 justify-end mr-2 p-4 border-t border-border mt-auto">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    type="button"
                >
                    Cancel
                </Button>
                {isFileUpload ? (
                    <Button
                        type="button"
                        onClick={onFileSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={onNext}
                        disabled={isLoading}
                    >
                        Next
                    </Button>
                )}
            </div>
        );
    } else if (currentStep === 2) {
        return (
            <div className="flex gap-3 justify-end mr-2 p-4 border-t border-border mt-auto">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    type="button"
                >
                    Cancel
                </Button>
                <Button
                    variant="outline"
                    onClick={onPrevious}
                    type="button"
                >
                    Back
                </Button>
                <Button
                    type="button"
                    onClick={onNext}
                    disabled={selectedTablesCount === 0}
                >
                    Next
                </Button>
            </div>
        );
    } else if (currentStep === 3) {
        return (
            <div className="flex gap-3 justify-end mr-2 p-4 border-t border-border mt-auto">
                <Button
                    variant="outline"
                    onClick={onPrevious}
                    type="button"
                >
                    Back
                </Button>
                <Button
                    type="button"
                    onClick={onSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? 'Connecting...' : 'Submit'}
                </Button>
            </div>
        );
    }
    
    return null;
};