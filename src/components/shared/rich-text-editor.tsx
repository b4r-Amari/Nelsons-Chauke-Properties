"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3, Pilcrow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils';


type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

const ToolbarButton = ({ onClick, children, tooltip }: { onClick: () => void, children: React.ReactNode, tooltip: string }) => (
    <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onMouseDown={(e) => {
            e.preventDefault(); // Prevent editor from losing focus
            onClick();
        }}
        title={tooltip}
    >
        {children}
    </Button>
);

const RichTextEditor = ({ value, onChange, className }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // This effect ensures the editor's content is synchronized with the `value` prop.
  // It only updates if the content is different, preventing cursor jumps during typing.
  useEffect(() => {
    const editor = editorRef.current;
    if (editor && value !== editor.innerHTML) {
      editor.innerHTML = value;
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);
  
  const execCmd = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
    handleInput(); // Immediately update state after command
  };

  return (
    <div className={cn("border rounded-lg shadow-sm bg-background", className)}>
        <div className="flex flex-wrap items-center gap-1 border-b p-2 bg-muted/50 rounded-t-lg">
            <ToolbarButton onClick={() => execCmd('bold')} tooltip="Bold">
                <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCmd('italic')} tooltip="Italic">
                <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCmd('underline')} tooltip="Underline">
                <Underline className="h-4 w-4" />
            </ToolbarButton>
            
            <Separator orientation="vertical" className="h-6 mx-1" />

            <ToolbarButton onClick={() => execCmd('insertUnorderedList')} tooltip="Unordered List">
                <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton onClick={() => execCmd('insertOrderedList')} tooltip="Ordered List">
                <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
            
            <Separator orientation="vertical" className="h-6 mx-1" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-8 w-auto px-3">
                    <Pilcrow className="h-4 w-4 mr-2" />
                    <span>Styles</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onMouseDown={(e) => {e.preventDefault(); execCmd('formatBlock', 'p')}}>
                    <Pilcrow className="h-4 w-4 mr-2" /> Paragraph
                </DropdownMenuItem>
                <DropdownMenuItem onMouseDown={(e) => {e.preventDefault(); execCmd('formatBlock', 'h1')}}>
                    <Heading1 className="h-4 w-4 mr-2" /> Heading 1
                </DropdownMenuItem>
                <DropdownMenuItem onMouseDown={(e) => {e.preventDefault(); execCmd('formatBlock', 'h2')}}>
                    <Heading2 className="h-4 w-4 mr-2" /> Heading 2
                </DropdownMenuItem>
                <DropdownMenuItem onMouseDown={(e) => {e.preventDefault(); execCmd('formatBlock', 'h3')}}>
                    <Heading3 className="h-4 w-4 mr-2" /> Heading 3
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

        </div>
        <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="prose dark:prose-invert max-w-none p-4 min-h-[350px] focus:outline-none focus:ring-2 focus:ring-ring rounded-b-lg"
            aria-label="Rich text editor"
        />
    </div>
  );
};

export default RichTextEditor;