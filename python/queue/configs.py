from common.object import Configs

queuer_configs = Configs(
    buffer_length = 1024,
    timeout=30,
    port = 10001,
    number_of_pmps = 4,
    result_file_directory = ""
)