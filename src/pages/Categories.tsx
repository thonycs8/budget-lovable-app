import { Folder } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOptimizedCategories } from '@/hooks/useOptimizedCategories';
import { Badge } from '@/components/ui/badge';

export default function Categories() {
  const { categories, isLoading: loading } = useOptimizedCategories();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando serviços...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Serviços</h1>
        <p className="text-muted-foreground">
          Visualize os serviços disponíveis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Folder className="h-5 w-5" style={{ color: category.color }} />
                {category.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {category.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {category.description}
                </p>
              )}
              <Badge 
                style={{ 
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                  borderColor: category.color
                }}
                variant="outline"
              >
                {category.color}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Folder className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma categoria encontrada</h3>
            <p className="text-muted-foreground text-center">
              As categorias aparecerão aqui quando forem criadas
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
