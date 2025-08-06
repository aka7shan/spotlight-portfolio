import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { AlertTriangle, Save, Trash2} from "lucide-react";

interface UnsavedChangesDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    onDiscard: () => void;
    changedSections: string[];
    targetDestination: string;
}

export function UnsavedChangesDialog({
    isOpen,
    onClose,
    onSave,
    onDiscard,
    changedSections,
    targetDestination
}: UnsavedChangesDialogProps) {

    const getDestinationLabel = (destination: string) => {
        switch (destination) {
            case 'home': return 'Home Page';
            case 'portfolios': return 'Templates';
            case 'profile': return 'Profile Settings';
            case 'experience': return 'Experience Tab';
            case 'education': return 'Education Tab';
            case 'certifications': return 'Certifications Tab';
            case 'achievements': return 'Achievements Tab';
            case 'languages': return 'Languages Tab';
            default: return destination;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-fit max-w-[90vw] p-0">
                <div className="flex items-center justify-between p-6 pb-2">
                    <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                        Unsaved Changes
                    </DialogTitle>
                    <DialogDescription className="sr-only"></DialogDescription>
                </div>
                <div className="px-6 pb-2">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        You have unsaved changes that will be lost if you continue to{' '}
                        <span className="font-semibold text-foreground">
                            {getDestinationLabel(targetDestination)}
                        </span>.
                    </p>
                </div>

                {/* Changed Sections */}
                {changedSections.length > 0 && (
                    <div className="px-6 pb-4">
                        <p className="text-sm text-muted-foreground font-medium mb-2">
                            Changes made in:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {changedSections.map((section, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-orange-600 border-orange-200 bg-orange-50 text-xs px-2 py-1"
                                >
                                    {section}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex flex-col gap-3 p-6 pt-4 border-t border-gray-200">
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                        {/* Cancel and Discard buttons */}
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 sm:flex-none text-sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={onDiscard}
                                className="flex-1 sm:flex-none text-sm"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Discard & Continue
                            </Button>
                        </div>

                        {/* Save button */}
                        <Button
                            onClick={onSave}
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-sm"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save & Continue
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}