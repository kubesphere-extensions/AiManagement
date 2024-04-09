import React, { useEffect } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Computing } from '@kubed/icons';
import { useQuery } from 'react-query';
import { get, set, uniq, isArray } from 'lodash';

import { NavMenu, NavTitle, useGlobalStore, request, getActions } from '@ks-console/shared';
import { navs as navMenus } from './contants';
import ClusterSelect from './clusterSelect';

const PageSide = styled.div`
  position: fixed;
  top: 88px;
  padding: 0 20px 40px;
  width: 260px;
  z-index: 99;

  p {
    color: #79879c;
    font-size: 12px;
    padding-left: 14px;
  }
`;

const PageMain = styled.div`
  margin-left: 240px;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const navKey = 'MANAGE_AI_NAV';

const safeParseJSON = (json: string, defaultValue?: Record<string, any>): Record<string, any> => {
  let result;
  try {
    result = JSON.parse(json);
  } catch (e) {}

  if (!result && defaultValue !== undefined) {
    return defaultValue;
  }
  return result;
};

export const fetchRules = async (params: any): Promise<any> => {
  let module = 'globalroles';
  let urlParams = '';
  if (params.namespace || params.devops) {
    module = 'roles';
    urlParams = `scope=namespace&namespace=${params.namespace}`;
  } else if (params.workspace) {
    module = 'workspaceroles';
    urlParams = `scope=workspace&workspace=${params.workspace}`;
  } else if (params.cluster) {
    module = 'clusterroles';
    urlParams = `scope=cluster&cluster=${params.cluster}`;
  }

  const roletemplatesUrl = `/${
    params.cluster ? `clusters/${params.cluster}/` : ''
  }kapis/iam.kubesphere.io/v1beta1/users/${globals.user?.username}/roletemplates?${urlParams}`;
  const resRoleTemplates = await request.get<any, any>(roletemplatesUrl);
  const roletemplatesList: Record<string, any>[] = get(resRoleTemplates, 'items', []);

  let rules: any = {};

  if (roletemplatesList.length > 0) {
    roletemplatesList.forEach(template => {
      const globalRuleName = get(template, 'metadata.name');
      const roleTemplateRules = safeParseJSON(
        get(template, "metadata.annotations['iam.kubesphere.io/role-template-rules']"),
        {},
      );
      Object.keys(roleTemplateRules).forEach(action => {
        rules[action] = rules[action] || [];
        if (isArray(roleTemplateRules[action])) {
          rules[action].push(...roleTemplateRules[action], globalRuleName);
        } else {
          rules[action].push(roleTemplateRules[action], globalRuleName);
        }
        rules[action] = uniq(rules[action]);
      });
    });
  }

  switch (module) {
    case 'globaleroles':
      set(globals.user, 'globalRules', rules);
      break;
    case 'clusterroles': {
      const parentActions = getActions({ module: 'clusters' });
      set(globals.user, `clusterRules[${params.cluster}]`, {
        ...rules,
        _: uniq(parentActions),
      });
      break;
    }
    case 'workspaceroles': {
      if (params.workspace === globals.config?.systemWorkspace) {
        set(globals.user, `workspaceRules[${params.workspace}]`, {
          ...globals.config?.systemWorkspaceRules,
        });
        break;
      }

      const parentActions = getActions({ module: 'workspaces' });
      set(globals.user, `workspaceRules[${params.workspace}]`, {
        ...rules,
        _: uniq(parentActions),
      });
      break;
    }
    case 'roles': {
      const obj: Record<string, any> = {};
      if (params.workspace) {
        obj.workspace = params.workspace;
      } else if (params.cluster) {
        obj.cluster = params.cluster;
      }

      if (params.namespace) {
        const parentActions = getActions({
          ...obj,
          module: 'projects',
        });

        if (params.workspace === globals.config?.systemWorkspace) {
          rules = globals.config?.systemWorkspaceProjectRules;
        }

        set(globals.user, `projectRules[${params.cluster}][${params.namespace}]`, {
          ...rules,
          _: uniq(parentActions),
        });
      } else if (params.devops) {
        const parentActions = getActions({
          ...obj,
          module: 'devops',
        });

        set(globals.user, `devopsRules[${params.cluster}][${params.devops}]`, {
          ...rules,
          _: uniq(parentActions),
        });
      }
      break;
    }
    default:
  }

  return rules;
};

function ListLayout(): JSX.Element {
  const location = useLocation();

  const params = useParams<'workspace' | 'cluster'>();
  const { cluster } = params;
  const { getNav, setNav } = useGlobalStore();

  let navs = getNav(navKey);

  useQuery(
    ['rule'],
    async () => {
      return await fetchRules({ cluster, name: globals.user.username });
    },
    {
      enabled: !!cluster,
    },
  );

  useEffect(() => {
    if (!navs) {
      setNav(navKey, navMenus);
    }
  }, []);

  return (
    <>
      <PageSide>
        <NavTitle
          icon={<Computing variant="light" size={40} />}
          title={t('AI_MANAGE')}
          subtitle={t('SUB_TITLE')}
          style={{ marginBottom: '20px' }}
        />
        <ClusterSelect />
        {navs && cluster && (
          <NavMenu navs={navs} prefix={`/ai-manage/${cluster}`} pathname={location.pathname} />
        )}
      </PageSide>
      <PageMain>{cluster && <Outlet />}</PageMain>
    </>
  );
}

export default ListLayout;
