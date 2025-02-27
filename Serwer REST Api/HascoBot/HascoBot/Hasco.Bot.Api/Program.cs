﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Hasco.Bot.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
        /* Host.CreateDefaultBuilder(args)
             .ConfigureWebHostDefaults(webBuilder =>
             {
                 webBuilder.UseStartup<Startup>(); 
                     //.UseUrls("http//localhost:4000");
             });
             */

        WebHost.CreateDefaultBuilder(args)
            .UseKestrel(options =>
            {             
                options.Limits.MaxRequestBodySize = null;
            })
            .UseStartup<Startup>();
    }
}


//public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
// WebHost.CreateDefaultBuilder(args)
//     .UseStartup<Startup>();