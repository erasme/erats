
namespace Core
{
    export class Uri extends Object
    {
        scheme: string;
        user: string;
        password: string;
        host: string;
        port: number;
        path: string;
        query: string;
        fragment: string;

        constructor(uri: string | null = null)
        {
            super();
            let fullpath = true;
            let baseURI : string;
            if('baseURI' in document)
                baseURI = document.baseURI;
            else
                baseURI = (document as any).location.href;

            if (uri == null)
                uri = baseURI;

            let res = uri!.match(/^([^:\/]+):\/\/([^\/]+)(\/.*)$/);
            if (res === null)
            {
                fullpath = false;
                res = baseURI.match(/^([^:\/]+):\/\/([^\/]+)(\/.*)$/);
                if (res == null)
                    throw `Invalid uri ${uri}`;
            }
            this.scheme = res[1];
            var authority = res[2];
            var path = res[3];
            res = authority.match(/^(.+):(.+)@(.*)$/);
            if (res !== null)
            {
                this.user = res[1];
                this.password = res[2];
                authority = res[3];
            }
            res = authority.match(/^(.+):(.+)$/);
            if (res !== null)
            {
                authority = res[1];
                this.port = parseInt(res[2]);
            }
            else
            {
                if (this.scheme == 'https')
                    this.port = 443;
                else
                    this.port = 80;
            }
            this.host = authority;
            if (fullpath)
                this.path = path;
            else {
                if (uri.indexOf('/') === 0)
                    this.path = Uri.cleanPath(uri);
                else
                    this.path = Uri.mergePath(path, uri);
            }
            // TODO: handle query and fragment
        }

        getScheme()
        {
            return this.scheme;
        }

        getUser()
        {
            return this.user;
        }

        getPassword()
        {
            return this.password;
        }

        getHost()
        {
            return this.host;
        }

        getPort()
        {
            return this.port;
        }

        getPath()
        {
            return this.path;
        }

        getQuery()
        {
            return this.query;
        }

        getFragment()
        {
            return this.fragment;
        }

        toString()
        {
            var str = this.scheme+'://';
            if((this.user !== undefined) && (this.password !== undefined))
                str += this.user+':'+this.password+'@';
            str += this.host;
            if(this.port !== undefined)
                str += ':'+this.port;
            str += this.path;
            return str;
        }

        static cleanPath(path: string)
        {
            while(path.match(/\/([^\/]*)\/\.\.\//))
                path = path.replace(/\/([^\/]*)\/\.\.\//, '/');
            while(path.match(/\/\//))
                path = path.replace(/\/\//, '/');
            while(path.match(/\/\.\//))
                path = path.replace(/\/\.\//, '/');
            return path;
        }

        static mergePath(base: string, relative: string)
        {
            let matches = base.match(/^(.*)\//);
            var dir = matches ? matches[0] : base;
            dir += relative;
            return Uri.cleanPath(dir);
        }
    }
}
