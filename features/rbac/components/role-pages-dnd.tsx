'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GripVertical, ChevronRight, ChevronLeft, X, Layout } from 'lucide-react';
import type { Page, Role } from '../types';

interface DraggablePageCardProps {
  page: Page;
  id: string;
  isAssigned?: boolean;
  onRemove?: (pageId: number) => void;
}

function DraggablePageCard({ page, id, isAssigned, onRemove }: DraggablePageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <GripVertical className="size-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Layout className="size-4 text-primary" />
              <h4 className="font-medium text-sm truncate">{page.display_name}</h4>
            </div>
            <p className="text-xs text-muted-foreground font-mono truncate">{page.path}</p>
            {page.group_name && (
              <Badge variant="outline" className="mt-2 text-xs">
                {page.group_name}
              </Badge>
            )}
          </div>
          {isAssigned && onRemove && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(page.id);
              }}
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

interface DroppableAreaProps {
  id: string;
  pages: Page[];
  isAssigned?: boolean;
  onRemove?: (pageId: number) => void;
  onDrop?: (page: Page) => void;
  emptyMessage?: string;
}

function DroppableArea({ id, pages, isAssigned, onRemove, onDrop, emptyMessage }: DroppableAreaProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[400px] p-4 rounded-lg border-2 border-dashed transition-colors ${
        isOver ? 'border-primary bg-primary/5' : 'border-border'
      }`}
    >
      {pages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pages.map(page => (
            <DraggablePageCard
              key={page.id}
              page={page}
              id={page.id.toString()}
              isAssigned={isAssigned}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface RolePagesDndProps {
  role: Role | null;
  allPages: Page[];
  assignedPages: Page[];
  onAssignPages: (pageIds: number[]) => Promise<void>;
  loading?: boolean;
}

export function RolePagesDnd({ role, allPages, assignedPages, onAssignPages, loading }: RolePagesDndProps) {
  const [availablePages, setAvailablePages] = useState<Page[]>(
    allPages.filter(p => !assignedPages.find(ap => ap.id === p.id))
  );
  const [selectedPages, setSelectedPages] = useState<Page[]>(assignedPages);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const activePage = availablePages.find(p => p.id.toString() === activeId) ||
                      selectedPages.find(p => p.id.toString() === activeId);

    if (!activePage) return;

    // Moving from available to assigned
    if (overId === 'assigned') {
      setAvailablePages(prev => prev.filter(p => p.id.toString() !== activeId));
      setSelectedPages(prev => [...prev, activePage]);
    }
    // Moving from assigned to available
    else if (overId === 'available') {
      setSelectedPages(prev => prev.filter(p => p.id.toString() !== activeId));
      setAvailablePages(prev => [...prev, activePage]);
    }
  };

  const moveToSelected = (page: Page) => {
    setAvailablePages(prev => prev.filter(p => p.id !== page.id));
    setSelectedPages(prev => [...prev, page]);
  };

  const moveToAvailable = (pageId: number) => {
    const page = selectedPages.find(p => p.id === pageId);
    if (page) {
      setSelectedPages(prev => prev.filter(p => p.id !== pageId));
      setAvailablePages(prev => [...prev, page]);
    }
  };

  const moveAllToSelected = () => {
    setSelectedPages(prev => [...prev, ...availablePages]);
    setAvailablePages([]);
  };

  const moveAllToAvailable = () => {
    setAvailablePages(prev => [...prev, ...selectedPages]);
    setSelectedPages([]);
  };

  const handleSave = async () => {
    await onAssignPages(selectedPages.map(p => p.id));
  };

  return (
    <div className="space-y-6">
      {!role && (
        <div className="text-center py-12 text-muted-foreground">
          Sélectionnez un rôle pour gérer ses pages
        </div>
      )}

      {role && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{role.display_name}</h2>
              <p className="text-muted-foreground">Gérer les pages assignées à ce rôle</p>
            </div>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-primary text-primary-foreground"
            >
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Available Pages */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Pages disponibles</h3>
                  <Badge variant="secondary">{availablePages.length}</Badge>
                </div>
                <DroppableArea
                  id="available"
                  pages={availablePages}
                  emptyMessage="Aucune page disponible"
                />
              </div>

              {/* Assigned Pages */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Pages assignées</h3>
                  <Badge variant="secondary">{selectedPages.length}</Badge>
                </div>
                <DroppableArea
                  id="assigned"
                  pages={selectedPages}
                  isAssigned
                  onRemove={moveToAvailable}
                  emptyMessage="Aucune page assignée"
                />
              </div>
            </div>
          </DndContext>

          {/* Quick Actions */}
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={moveAllToSelected}
              disabled={availablePages.length === 0}
              className="gap-2"
            >
              <ChevronRight className="size-4" />
              Tout assigner
            </Button>
            <Button
              variant="outline"
              onClick={moveAllToAvailable}
              disabled={selectedPages.length === 0}
              className="gap-2"
            >
              <ChevronLeft className="size-4" />
              Tout retirer
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
