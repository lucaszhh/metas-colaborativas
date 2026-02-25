import { useMemo, useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useActiveWorkspace } from "@/features/workspaces/hooks/useActiveWorkspace";
import { useGoalLists } from "@/features/goals/hooks/useGoalLists";
import { useGoalMutations } from "@/features/goals/hooks/useGoalMutations";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGoalsByList } from "../hooks/useGoalsByList";

export function Dashboard() {
  const {
    user,
    workspaceId,
    loading,
    workspaces,
    error: workspaceError,
    setActiveWorkspaceId,
    createAndSelectWorkspace,
    creatingWorkspace,
  } = useActiveWorkspace();

  const {
    lists,
    loading: listsLoading,
    error: listsError,
  } = useGoalLists(workspaceId);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  useEffect(() => {
    if (lists.length === 0) {
      if (selectedListId) setSelectedListId(null);
      return;
    }
    const exists = selectedListId && lists.some((l) => l.id === selectedListId);
    if (!exists) setSelectedListId(lists[0].id);
  }, [lists, selectedListId]);

  const {
    goals,
    loading: goalsLoading,
    error: goalsError,
  } = useGoalsByList(workspaceId, selectedListId);

  const selectedList = useMemo(
    () => lists.find((l) => l.id === selectedListId) ?? null,
    [lists, selectedListId]
  );

  const openGoals = useMemo(() => goals.filter((g) => g.status !== "close"), [goals]);
  const closedGoals = useMemo(() => goals.filter((g) => g.status === "close"), [goals]);

  const [newListTitle, setNewListTitle] = useState("");
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { createList, createGoal, updateStatus, updateGoal, deleteGoal } = useGoalMutations();

  useEffect(() => {
    setEditingGoalId(null);
    setConfirmDeleteId(null);
  }, [selectedListId]);

  if (loading) return <DashboardSkeleton />;
  if (!user) return <div className="p-6">Sin sesión</div>;

  const handleCreateList = async () => {
    const title = newListTitle.trim();
    if (!title || !workspaceId || createList.isPending) return;

    const id = await createList.mutateAsync({ workspaceId, uid: user.uid, title });
    setNewListTitle("");
    setSelectedListId(id);
  };

  const handleCreateGoal = async () => {
    const title = newGoalTitle.trim();
    if (!title || !selectedListId || !workspaceId || createGoal.isPending) return;

    await createGoal.mutateAsync({
      workspaceId,
      uid: user.uid,
      listId: selectedListId,
      title,
    });
    setNewGoalTitle("");
  };

  const handleCreateWorkspace = async () => {
    const name = newWorkspaceName.trim();
    if (!name || creatingWorkspace) return;
    await createAndSelectWorkspace(name);
    setNewWorkspaceName("");
  };

  const handleToggleGoal = (goalId: string, status: "open" | "close") => {
    if (!workspaceId || !selectedListId) return;
    updateStatus.mutate({
      workspaceId,
      listId: selectedListId,
      goalId,
      status,
    });
  };

  const startEditGoal = (goal: { id: string; title: string; description?: string }) => {
    setEditingGoalId(goal.id);
    setEditingTitle(goal.title);
    setEditingDescription(goal.description ?? "");
    setConfirmDeleteId(null);
  };

  const cancelEditGoal = () => {
    setEditingGoalId(null);
    setEditingTitle("");
    setEditingDescription("");
  };

  const saveEditGoal = async () => {
    if (!workspaceId || !selectedListId || !editingGoalId || updateGoal.isPending) return;
    const title = editingTitle.trim();
    if (!title) return;

    await updateGoal.mutateAsync({
      workspaceId,
      listId: selectedListId,
      goalId: editingGoalId,
      title,
      description: editingDescription.trim(),
    });
    cancelEditGoal();
  };

  const requestDeleteGoal = (goalId: string) => {
    setConfirmDeleteId(goalId);
    if (editingGoalId === goalId) cancelEditGoal();
  };

  const cancelDeleteGoal = () => setConfirmDeleteId(null);

  const confirmDeleteGoal = async (goalId: string) => {
    if (!workspaceId || !selectedListId || deleteGoal.isPending) return;

    await deleteGoal.mutateAsync({
      workspaceId,
      listId: selectedListId,
      goalId,
    });
    if (confirmDeleteId === goalId) setConfirmDeleteId(null);
  };

  const renderGoalCard = (g: {
    id: string;
    title: string;
    description?: string;
    status: "open" | "close";
  }) => {
    const isClosed = g.status === "close";
    const isUpdatingStatus = updateStatus.isPending && updateStatus.variables?.goalId === g.id;
    const isUpdatingGoal = updateGoal.isPending && updateGoal.variables?.goalId === g.id;
    const isDeletingGoal = deleteGoal.isPending && deleteGoal.variables?.goalId === g.id;
    const isEditing = editingGoalId === g.id;
    const isConfirmingDelete = confirmDeleteId === g.id;

    return (
      <div key={g.id} className="rounded-md border p-3 space-y-2">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={isClosed}
            onChange={() => handleToggleGoal(g.id, isClosed ? "open" : "close")}
            disabled={isUpdatingStatus || isEditing || isConfirmingDelete}
            className="h-4 w-4 accent-primary"
          />
          <span
            className={
              isClosed ? "line-through text-muted-foreground" : ""
            }
          >
            {g.title}
          </span>
          {!isEditing && !isConfirmingDelete && (
            <div className="ml-auto flex gap-2">
              <Button size="xs" variant="outline" onClick={() => startEditGoal(g)}>
                Editar
              </Button>
              <Button size="xs" variant="destructive" onClick={() => requestDeleteGoal(g.id)}>
                Eliminar
              </Button>
            </div>
          )}
        </div>

        {!isEditing && g.description && (
          <p className="text-xs text-muted-foreground">{g.description}</p>
        )}

        {isConfirmingDelete && (
          <div className="flex items-center gap-2">
            <Button
              size="xs"
              variant="destructive"
              onClick={() => confirmDeleteGoal(g.id)}
              disabled={isDeletingGoal}
            >
              {isDeletingGoal ? "Eliminando..." : "Confirmar"}
            </Button>
            <Button size="xs" variant="ghost" onClick={cancelDeleteGoal}>
              Cancelar
            </Button>
          </div>
        )}

        {isEditing && (
          <div className="space-y-2">
            <Input
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              placeholder="Título"
              disabled={isUpdatingGoal}
            />
            <Textarea
              value={editingDescription}
              onChange={(e) => setEditingDescription(e.target.value)}
              placeholder="Descripción"
              disabled={isUpdatingGoal}
            />
            <div className="flex items-center gap-2">
              <Button size="xs" onClick={saveEditGoal} disabled={isUpdatingGoal}>
                {isUpdatingGoal ? "Guardando..." : "Guardar"}
              </Button>
              <Button size="xs" variant="ghost" onClick={cancelEditGoal}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Workspace activo: {workspaceId ?? "—"}
        </p>
      </div>

      {workspaceError && (
        <ErrorBanner message="No se pudieron cargar tus workspaces." />
      )}

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Workspaces</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Nuevo workspace"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                disabled={creatingWorkspace}
              />
              <Button onClick={handleCreateWorkspace} disabled={creatingWorkspace}>
                {creatingWorkspace && <Loader2 className="animate-spin" />}
                {creatingWorkspace ? "Creando..." : "Crear"}
              </Button>
            </div>

            <ScrollArea className="h-40 pr-2">
              <div className="space-y-2">
                {workspaces.map((w) => (
                  <Button
                    key={w.id}
                    variant={w.id === workspaceId ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveWorkspaceId(w.id)}
                  >
                    {w.name}
                  </Button>
                ))}

                {workspaces.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    Todavía no tenés workspaces. Creá el primero.
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Listas</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Nueva lista (ej: Salud)"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                disabled={!workspaceId || createList.isPending}
              />
              <Button onClick={handleCreateList} disabled={!workspaceId || createList.isPending}>
                {createList.isPending && <Loader2 className="animate-spin" />}
                {createList.isPending ? "Creando..." : "Crear"}
              </Button>
            </div>

            {listsError && <ErrorBanner message="No se pudieron cargar las listas." />}

            <ScrollArea className="h-105 pr-2">
              <div className="space-y-2">
                {listsLoading && (
                  <>
                    <Skeleton className="h-9" />
                    <Skeleton className="h-9" />
                    <Skeleton className="h-9" />
                  </>
                )}

                {!listsLoading &&
                  lists.map((l) => (
                    <Button
                      key={l.id}
                      variant={l.id === selectedListId ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => setSelectedListId(l.id)}
                    >
                      {l.title}
                    </Button>
                  ))}

                {workspaceId && !listsLoading && lists.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    No hay listas todavía. Creá la primera.
                  </div>
                )}
                {!workspaceId && (
                  <div className="text-sm text-muted-foreground">
                    Seleccioná un workspace para ver sus listas.
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              Metas{selectedList ? ` — ${selectedList.title}` : ""}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Nueva meta (ej: Entrenar 3x semana)"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                disabled={!selectedListId || !workspaceId || createGoal.isPending}
              />
              <Button
                onClick={handleCreateGoal}
                disabled={!selectedListId || !workspaceId || createGoal.isPending}
              >
                {createGoal.isPending && <Loader2 className="animate-spin" />}
                {createGoal.isPending ? "Agregando..." : "Agregar"}
              </Button>
            </div>

            {goalsError && <ErrorBanner message="No se pudieron cargar las metas." />}

            <ScrollArea className="h-105 pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <span>Open</span>
                    <span>{openGoals.length}</span>
                  </div>

                  {goalsLoading && (
                    <>
                      <Skeleton className="h-12" />
                      <Skeleton className="h-12" />
                      <Skeleton className="h-12" />
                    </>
                  )}

                  {!goalsLoading && openGoals.map(renderGoalCard)}

                  {selectedListId && !goalsLoading && openGoals.length === 0 && (
                    <div className="text-sm text-muted-foreground">No hay metas abiertas.</div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <span>Close</span>
                    <span>{closedGoals.length}</span>
                  </div>

                  {goalsLoading && (
                    <>
                      <Skeleton className="h-12" />
                      <Skeleton className="h-12" />
                      <Skeleton className="h-12" />
                    </>
                  )}

                  {!goalsLoading && closedGoals.map(renderGoalCard)}

                  {selectedListId && !goalsLoading && closedGoals.length === 0 && (
                    <div className="text-sm text-muted-foreground">No hay metas cerradas.</div>
                  )}
                </div>
              </div>

              {!workspaceId && (
                <div className="text-sm text-muted-foreground">
                  Seleccioná un workspace para ver metas.
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
      {message}
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={["animate-pulse rounded-md bg-muted", className].join(" ")} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div>
        <Skeleton className="h-7 w-40" />
        <Skeleton className="mt-2 h-4 w-56" />
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Workspaces</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-9" />
            <div className="space-y-2">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Listas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-9" />
            <div className="space-y-2">
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
              <Skeleton className="h-9" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Metas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-9" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
