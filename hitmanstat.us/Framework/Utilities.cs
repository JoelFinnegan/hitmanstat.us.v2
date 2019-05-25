﻿using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Linq;
using System.Net.Http.Headers;

namespace hitmanstat.us.Framework
{
    public class Utilities
    {
        public static bool IsJsonResponse(HttpContentHeaders headers)
        {
            string value = string.Empty;

            if (headers.TryGetValues("Content-Type", out IEnumerable<string> values))
            {
                value = values.First();
            }

            return value.Contains("application/json");
        }

        public static string ReadResourceFile(byte[] resource)
        {
            using (Stream stream = new MemoryStream(resource))
            using (StreamReader reader = new StreamReader(stream))
            {
                return reader.ReadToEnd();
            }
        }
    }
}
