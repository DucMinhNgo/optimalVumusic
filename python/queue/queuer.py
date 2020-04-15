"""
There're three parts in the queuer

1. Client API sends queries to queuer
Client ===(queries)===> Queuer

2. Queuer will handle the queries and also multiple pre-loaded model processes (PMPs)

Queuer[queuires] ===(pop one query)===> PMP #nth
Queuer[results] <===(predict)=== PMP #nth

3. Queuer send the predictions to client

Queuer ===(results)===> Client
"""
import random
import socket
import time
import sys
import json

from queue import Queue 
from queue.configs import queuer_configs
from threading import Thread

def send_queries(params_dict):
    query = json.dumps(params_dict)
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    client_socket.sendto(query.encode("utf-8"), ('localhost', queuer_configs.port))
    client_socket.settimeout(queuer_configs.timeout)
    
    response = json.loads(client_socket.recv(1024))
    return response
    
class Queuer():
    def __init__(self, configs):
        Thread.__init__(self)
        
        # q_ pre-fix is stand for Queue object
        self.q_queries = Queue()
        self.q_results = Queue()
        
        self.configs = configs
        
        # Initialize workers thread
        self.workers = []
        self.init_pmps()
        self.recv_queries_worker = None
        self.send_queries_worker = None

        # Initialize receive queries socket
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.socket.bind(('localhost', configs.port))
        
        print('Initialization Completed')
                
    def __call__(self):
        """Execute the queuer to interchange info from client"""
        self.recv_queries_worker = Thread(target = self.recv_queries, daemon=True)
        self.recv_queries_worker.start()
        self.send_queries_worker = Thread(target = self.send_queries, daemon=True)
        self.send_queries_worker.start()

        print('Ready to interchange queries')
        while(True): 
            pass

    def stop(self):
        self.workers.terminate()
        
    def init_interchange_processes(self):
        """Initialize threads to interchange queries with the client"""
        
    def recv_queries(self):
        while(True):
            query, client_address = self.socket.recvfrom(1024)
            print(query, client_address)
            self.q_queries.put((json.loads(query), client_address)) 
    
    def send_queries(self):
        while(True):
            result, client_address = self.q_results.get()
            self.socket.sendto(json.dumps(result).encode("utf-8"), client_address)
        
    def init_pmps(self):
        """Initialize threads to pre-load models"""
        for idx in range(self.configs.number_of_pmps):
            pmp = PMP(idx=idx, q_queries=self.q_queries, q_results=self.q_results); pmp()
            self.workers.append(pmp)
            
class PMP(Thread):
    def __init__(self, **kwargs):
        Thread.__init__(self)
        
        self.daemon = True
        for key, value in kwargs.items():
            setattr(self, key, value)
    
        self.session = None
    
        self.load_model()
    
    def load_model(self):
        """Load session"""
        pass
    
    def predict(self, query):
        """Predict based on query"""
        print('PMP #{} received query {}'.format(self.idx, query))
        time.sleep(random.random())
        
        result = dict(file_path = 'abc/xyz')
        
        return result
    
    def __call__(self):
        self.start()
        
    def run(self):
        while(True):
            query, client_address = self.q_queries.get()
            result = self.predict(query)
            
            self.q_results.put((result, client_address))

if __name__ == '__main__':
    q = Queuer(queuer_configs)
    q()