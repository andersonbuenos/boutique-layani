export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      erro: 'Acesso negado. Esta operação exige privilégios de Administrador (admin).',
      papelAtual: req.user?.role || 'desconhecido',
    });
  }
  next();
}

export function requireRoles(rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({
        erro: `Acesso negado. Apenas os seguintes perfis têm permissão: [${rolesPermitidos.join(', ')}]`,
        papelAtual: req.user?.role || 'desconhecido',
      });
    }
    next();
  };
}
