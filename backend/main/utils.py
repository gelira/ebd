from rest_framework.generics import get_object_or_404

from . import models

PROFESSOR = models.Usuario.PROFESSOR
SECRETARIO_CONGREGACAO = models.Usuario.SECRETARIO_CONGREGACAO
SUPERINTENDENTE_CONGREGACAO = models.Usuario.SUPERINTENDENTE_CONGREGACAO

CARGOS_CONGREGACAO = [
    SECRETARIO_CONGREGACAO,
    SUPERINTENDENTE_CONGREGACAO
]

def get_classe(user, classe_uid):
    filter_dict = {
        'uid': classe_uid
    }

    if user.role == PROFESSOR:
        filter_dict['id'] = user.entity_id

    elif user.role in CARGOS_CONGREGACAO:
        filter_dict['congregacao_id'] = user.entity_id

    else:
        filter_dict['congregacao__igreja_id'] = user.entity_id

    return get_object_or_404(models.Classe, **filter_dict)

def get_aula(user, aula_uid, not_concluded=False):
    filter_dict = {
        'uid': aula_uid
    }

    if not_concluded:
        filter_dict['concluida'] = False
        filter_dict['periodo__concluido'] = False

    if user.role == PROFESSOR:
        filter_dict['periodo__congregacao__classe__id'] = user.entity_id

    elif user.role in CARGOS_CONGREGACAO:
        filter_dict['periodo__congregacao_id'] = user.entity_id

    else:
        filter_dict['periodo__congregacao__igreja_id'] = user.entity_id

    return get_object_or_404(models.Aula, **filter_dict)
